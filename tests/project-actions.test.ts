import { beforeEach, expect, mock, test } from "bun:test";
import jwt from "jsonwebtoken";
import { blankProject } from "../lib/project-content";

let role = "none", calls = 0, result: unknown = "ok";
let args: unknown[] = [], tags: string[] = [], signedOptions: Record<string, unknown> = {};
mock.module("server-only", () => ({}));
mock.module("next/headers", () => ({ cookies: async () => ({ get: () => role === "none" ? undefined : { value: jwt.sign({ role }, "test-editor-secret") } }), headers: async () => new Headers() }));
mock.module("@upstash/redis", () => ({ Redis: { fromEnv: () => ({ eval: async (...input: unknown[]) => { calls++; args = input; return result; } }) } }));
mock.module("next/cache", () => ({ updateTag: (tag: string) => tags.push(tag), revalidatePath: () => {}, cacheTag: () => {} }));
mock.module("@aws-sdk/s3-presigned-post", () => ({ createPresignedPost: async (_client: unknown, options: Record<string, unknown>) => { signedOptions = options; calls++; return { url: "https://storage.test", fields: { key: options.Key } }; } }));
const { saveProject, deleteProject, setProjectHidden } = await import("../functions/project-actions");
const { createMediaUpload } = await import("../functions/media-actions");
const { changeProjectDesc, deleteItem } = await import("../functions/legacy-editor-actions");

beforeEach(() => { process.env.SECRET_KEY = "test-editor-secret"; role = "admin"; calls = 0; result = "ok"; tags = []; args = []; });
const project = () => ({ ...blankProject(), id: "my-story", name: "My story" });

test("all project writes and upload authorizations reject visitors and members before storage access", async () => {
    for (const deniedRole of ["none", "member", "expired"]) {
        role = deniedRole;
        expect((await saveProject("project:1", project())).success).toBe(false);
        expect((await setProjectHidden("my-story", true)).success).toBe(false);
        expect((await deleteProject("my-story")).success).toBe(false);
        expect((await createMediaUpload("video", "video/mp4", 100)).success).toBe(false);
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

test("visibility and deletion invalidate project caches", async () => {
    result = 1;
    expect((await setProjectHidden("my-story", true)).success).toBe(true);
    expect((await deleteProject("my-story")).success).toBe(true);
    expect(tags).toEqual(["projects", "projects"]);
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
