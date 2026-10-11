import { beforeEach, expect, mock, spyOn, test } from "bun:test";
import { S3Client } from "@aws-sdk/client-s3";
import jwt from "jsonwebtoken";
import { blankProject } from "../lib/project-content";
import { mediaOrigin, projectMediaUrls, uploadedMediaKey } from "../lib/media";

let role = "none", calls = 0, result: unknown = ["ok", "", ""];
let args: unknown[] = [], tags: string[] = [], signedOptions: Record<string, unknown> = {};
let records: Record<string, { image?: unknown; data?: unknown; url?: string }> = {};
let deletedKeys: string[] = [], failedKeys: string[] = [], failReads = false;
spyOn(S3Client.prototype, "send").mockImplementation(async (command: any) => {
    const keys = command.input.Delete.Objects.map((object: { Key: string }) => object.Key);
    deletedKeys.push(...keys);
    return { Errors: keys.filter((key: string) => failedKeys.includes(key)).map((Key: string) => ({ Key, Code: "AccessDenied" })) };
});
mock.module("server-only", () => ({}));
mock.module("next/headers", () => ({ cookies: async () => ({ get: () => role === "none" ? undefined : { value: jwt.sign({ role }, "test-editor-secret") } }), headers: async () => new Headers() }));
mock.module("@upstash/redis", () => ({ Redis: { fromEnv: () => ({
    eval: async (...input: any[]) => {
        calls++; args = input;
        if (Array.isArray(result) && result[0] === "ok") {
            const values = input[2];
            records[input[1][0]] = { image: values[values.indexOf("image") + 1], data: values[values.indexOf("data") + 1] };
        }
        return result;
    },
    keys: async (pattern: string) => { calls++; if (failReads) throw new Error("Offline"); return Object.keys(records).filter(key => key.startsWith(pattern.slice(0, -1))); },
    hmget: async (key: string) => records[key],
    hget: async (key: string) => records[key]?.url,
}) } }));
mock.module("next/cache", () => ({ updateTag: (tag: string) => tags.push(tag), revalidatePath: () => {}, cacheTag: () => {} }));
mock.module("@aws-sdk/s3-presigned-post", () => ({ createPresignedPost: async (_client: unknown, options: Record<string, unknown>) => { signedOptions = options; calls++; return { url: "https://storage.test", fields: { key: options.Key } }; } }));
const { saveProject, deleteProject, setProjectHidden } = await import("../functions/project-actions");
const { createMediaUpload, discardProjectMedia } = await import("../functions/media-actions");
const { changeProjectDesc, deleteItem } = await import("../functions/legacy-editor-actions");

beforeEach(() => { process.env.SECRET_KEY = "test-editor-secret"; role = "admin"; calls = 0; result = ["ok", "", ""]; tags = []; args = []; records = {}; deletedKeys = []; failedKeys = []; failReads = false; });
const project = () => ({ ...blankProject(), id: "my-story", name: "My story" });

test("all project writes and upload authorizations reject visitors and members before storage access", async () => {
    for (const deniedRole of ["none", "member", "expired"]) {
        role = deniedRole;
        expect((await saveProject("project:1", project())).success).toBe(false);
        expect((await setProjectHidden("my-story", true)).success).toBe(false);
        expect((await deleteProject("my-story")).success).toBe(false);
        expect((await createMediaUpload("video", "video/mp4", 100)).success).toBe(false);
        expect((await discardProjectMedia([`${mediaOrigin}/projects/uploads/draft.mp4`])).success).toBe(false);
        await expect(changeProjectDesc("project:1", "changed")).rejects.toThrow("admin session");
        await expect(deleteItem("project:1")).rejects.toThrow("admin session");
        expect(calls).toBe(0);
    }
});

test("save preserves legacy payload, adds structured content and invalidates readers", async () => {
    const draft = project(); draft.data.main.cover.text = "Original";
    const saved = await saveProject("project:1", draft);
    expect(saved.success).toBe(true);
    expect(tags).toContain("projects");
    const input = args[2] as (string | number)[];
    expect(input[0]).toBe("update");
    expect(JSON.parse(String(input[input.indexOf("data") + 1])).main.cover.text).toBe("Original");
    expect(input[input.indexOf("revision") + 1]).toBe(1);
});

test("conflicting saves and duplicate URLs report actionable errors without cache invalidation", async () => {
    result = "conflict";
    const conflict = await saveProject("project:1", project());
    expect(conflict.success).toBe(false);
    if (!conflict.success) expect(conflict.message).toContain("another window");
    result = "url";
    const duplicate = await saveProject(null, project());
    expect(duplicate.success).toBe(false);
    if (!duplicate.success) expect(duplicate.message).toContain("already in use");
    expect(tags).toEqual([]);
});

test("malformed project data is rejected before a database call", async () => {
    const invalid = project(); invalid.id = "users:admin";
    expect((await saveProject("project:1", invalid)).success).toBe(false);
    expect((await saveProject("users:admin", project())).success).toBe(false);
    expect(calls).toBe(0);
});

test("project creation uses a server timestamp rather than a client-supplied creation date", async () => {
    const started = Date.now();
    const draft = { ...project(), date_created: "1999-01-01T00:00:00.000Z" };
    expect((await saveProject(null, draft)).success).toBe(true);
    const input = args[2] as (string | number)[];
    const timestamp = String(input[2]);
    expect(input[0]).toBe("create");
    expect(new Date(timestamp).toISOString()).toBe(timestamp);
    expect(Date.parse(timestamp)).toBeGreaterThanOrEqual(started);
    expect(Date.parse(timestamp)).toBeLessThanOrEqual(Date.now());
    expect(input).not.toContain(draft.date_created);
    // The atomic script writes this only for creation; subsequent edits preserve it.
    expect(String(args[0])).toContain("if not exists then redis.call('HSET', KEYS[1], 'date_created', ARGV[3]) end");
});

test("visibility and deletion invalidate project caches", async () => {
    result = 1;
    expect((await setProjectHidden("my-story", true)).success).toBe(true);
    result = ["", ""];
    expect((await deleteProject("my-story")).success).toBe(true);
    expect(tags).toEqual(["projects", "projects"]);
});

test("saving a removed video deletes its upload and poster while retaining reused images", async () => {
    const old = project();
    const kept = `${mediaOrigin}/projects/uploads/kept.jpg`;
    old.data.main.blocks = [
        { id: "image", type: "image", image: { url: kept, alt: "", caption: "" } },
        { id: "video", type: "video", url: `${mediaOrigin}/projects/uploads/removed.mp4`, poster: `${mediaOrigin}/projects/uploads/poster.jpg`, title: "", caption: "", subtitles: `${mediaOrigin}/projects/uploads/subtitles.vtt` },
    ];
    result = ["ok", JSON.stringify(old.data), kept];
    const updated = structuredClone(old); updated.data.main.blocks = [old.data.main.blocks[0]];
    const response = await saveProject("project:1", updated);
    expect(response.success).toBe(true);
    expect(deletedKeys.sort()).toEqual(["projects/uploads/poster.jpg", "projects/uploads/removed.mp4", "projects/uploads/subtitles.vtt"]);
    if (response.success) expect(response.cleanupPending).toEqual([]);
});

test("saving an uploaded-then-removed draft cleans up unreferenced uploads", async () => {
    const response = await saveProject(null, project(), [`${mediaOrigin}/projects/uploads/draft.mp4`]);
    expect(response.success).toBe(true);
    expect(deletedKeys).toEqual(["projects/uploads/draft.mp4"]);
});

test("saving toggle images retains both uploads, then removing the toggle cleans up both", async () => {
    const draft = project();
    const urls = ["before", "after"].map(name => `${mediaOrigin}/projects/uploads/${name}.jpg`);
    draft.data.main.blocks = [{ id: "toggle", type: "image-toggle", options: [
        { label: "Before", image: { url: urls[0], alt: "Before", caption: "" } },
        { label: "After", image: { url: urls[1], alt: "After", caption: "" } },
    ] }];
    expect((await saveProject("project:1", draft, urls)).success).toBe(true);
    expect(deletedKeys).toEqual([]);
    result = ["ok", JSON.stringify(draft.data), ""];
    const updated = structuredClone(draft); updated.data.main.blocks = [];
    expect((await saveProject("project:1", updated)).success).toBe(true);
    expect(deletedKeys.sort()).toEqual(["projects/uploads/after.jpg", "projects/uploads/before.jpg"]);
});

test("project deletion preserves files referenced by another project or an exploration", async () => {
    const old = project();
    const shared = `${mediaOrigin}/projects/uploads/shared.jpg`;
    old.image = shared;
    old.data.main.blocks = [{ id: "video", type: "video", url: `${mediaOrigin}/projects/uploads/deleted.mp4`, poster: `${mediaOrigin}/projects/uploads/exploration.jpg`, title: "", caption: "", subtitles: "" }];
    records["project:other"] = { image: shared, data: JSON.stringify(project().data) };
    records["photography:1"] = { url: `${mediaOrigin}/projects/uploads/exploration.jpg` };
    result = [JSON.stringify(old.data), old.image];
    const response = await deleteProject("my-story");
    expect(response.success).toBe(true);
    expect(deletedKeys).toEqual(["projects/uploads/deleted.mp4"]);
});

test("failed storage deletions are reported separately from a successful save and can be retried", async () => {
    failedKeys = ["projects/uploads/retry.jpg"];
    const response = await saveProject("project:1", project(), [`${mediaOrigin}/projects/uploads/retry.jpg`]);
    expect(response.success).toBe(true);
    if (!response.success) throw new Error("Save failed");
    expect(response.cleanupPending).toEqual([`${mediaOrigin}/projects/uploads/retry.jpg`]);
    failedKeys = [];
    expect((await discardProjectMedia(response.cleanupPending)).success).toBe(true);
    expect(deletedKeys).toEqual(["projects/uploads/retry.jpg", "projects/uploads/retry.jpg"]);
});

test("cleanup fails closed when references cannot be read, and rejects unmanaged URLs", async () => {
    failReads = true;
    const response = await discardProjectMedia([`${mediaOrigin}/projects/uploads/safe.jpg`]);
    expect(response.success).toBe(false);
    expect(response.pending).toHaveLength(1);
    expect(deletedKeys).toEqual([]);
    calls = 0;
    expect((await discardProjectMedia(["https://example.com/file.jpg"])).success).toBe(false);
    expect((await discardProjectMedia([`${mediaOrigin}/settings.json`])).success).toBe(false);
    expect(calls).toBe(0);
});

test("media references use active blocks, support legacy data and normalize encoded keys", () => {
    const record = project();
    record.data.main.cover.image = `${mediaOrigin}/projects/old%20folder/old.jpg`;
    expect(projectMediaUrls(record)).toEqual([]);
    expect(projectMediaUrls(record, true)).toEqual([record.data.main.cover.image]);
    const legacy = structuredClone(record); delete legacy.data.main.blocks;
    expect(projectMediaUrls({ data: JSON.stringify(legacy.data).replaceAll('"', "&quot") })).toEqual([record.data.main.cover.image]);
    expect(uploadedMediaKey(record.data.main.cover.image)).toBe("projects/old folder/old.jpg");
    expect(uploadedMediaKey(`${mediaOrigin}.evil.test/projects/file.jpg`)).toBeNull();
});

test("conflicting saves never delete draft media", async () => {
    result = "conflict";
    expect((await saveProject("project:1", project(), [`${mediaOrigin}/projects/uploads/draft.jpg`])).success).toBe(false);
    expect(deletedKeys).toEqual([]);
});

test("a newly saved upload is retained even when it was tracked as draft media", async () => {
    const draft = project();
    draft.image = `${mediaOrigin}/projects/uploads/new-cover.jpg`;
    expect((await saveProject(null, draft, [draft.image])).success).toBe(true);
    expect(deletedKeys).toEqual([]);
});

test("malformed current references prevent cleanup, but malformed deleted content does not misreport a successful deletion", async () => {
    const url = `${mediaOrigin}/projects/uploads/keep.jpg`;
    records["project:broken"] = { data: "not valid JSON" };
    expect((await discardProjectMedia([url])).success).toBe(false);
    expect(deletedKeys).toEqual([]);
    records = {};
    result = [`{"main": {"url": "${url}"`, ""];
    expect((await deleteProject("my-story")).success).toBe(true);
    expect(deletedKeys).toEqual(["projects/uploads/keep.jpg"]);
});

test("video upload policy restricts size, MIME, destination and expiry", async () => {
    const upload = await createMediaUpload("video", "video/mp4", 20 * 1024 * 1024);
    expect(upload.success).toBe(true);
    expect(signedOptions.Key).toMatch(/^projects\/uploads\/[a-f0-9-]+\.mp4$/);
    expect(signedOptions.Expires).toBe(600);
    expect(signedOptions.Conditions).toEqual([["content-length-range", 1, 250 * 1024 * 1024], ["eq", "$Content-Type", "video/mp4"]]);
    expect((await createMediaUpload("video", "text/html", 100)).success).toBe(false);
    expect(calls).toBe(1);
});
