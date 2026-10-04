import { expect, test } from "bun:test";
import { blankProject, canViewProject, isHidden, newBlock, newestProjectsFirst, safeImage, safeLink, storyBlocks, validateProject } from "../lib/project-content";
import { validateMedia } from "../lib/media";

test("projects sort newest first while undated legacy projects keep their relative order", () => {
    const projects = [{ id: "legacy-a" }, { id: "older", date_created: "2026-09-01T00:00:00.000Z" }, { id: "legacy-b", date_created: "invalid" }, { id: "newer", date_created: "2026-10-04T00:00:00.000Z" }];
    expect(newestProjectsFirst(projects).map(project => project.id)).toEqual(["newer", "older", "legacy-a", "legacy-b"]);
    expect(projects[0].id).toBe("legacy-a");
});

test("legacy content converts without mutating or dropping original image/text fields", () => {
    const project = blankProject();
    delete project.data.main.blocks;
    project.data.main.cover = { text: "Hello<br>world", image: "/cover.jpg" };
    project.data.main.body.normal = [{ header: "Process", text: "Research", image: "/process.jpg" }];
    project.data.main.body.grid = { use: true, header: "Gallery", text: "Caption", images: ["/one.jpg", "/two.jpg"] };
    const original = JSON.stringify(project);
    const blocks = storyBlocks(project);
    expect(blocks.filter(b => b.type === "heading").map(b => b.id)).toEqual(["challenge", "section-0", "gallery"]);
    expect(blocks.find(b => b.type === "text")?.text).toBe("Hello\nworld");
    expect(blocks.filter(b => b.type === "image")).toHaveLength(2);
    expect(blocks.find(b => b.type === "gallery")?.images).toHaveLength(2);
    expect(JSON.stringify(project)).toBe(original);
});

test("explicit empty blocks do not resurrect deleted legacy content", () => {
    const project = blankProject(); project.data.main.cover.text = "Old content";
    expect(storyBlocks(project)).toEqual([]);
});

test("hidden projects are admin-only, even for members; legacy visibility remains unchanged", () => {
    for (const hidden of [true, 1, "1", "true"]) {
        expect(isHidden(hidden)).toBe(true);
        for (const role of ["none", "member", "expired"]) expect(canViewProject({ hidden, access: "public" }, role)).toBe(false);
        expect(canViewProject({ hidden, access: "member" }, "admin")).toBe(true);
    }
    expect(canViewProject({ access: "public" }, "none")).toBe(true);
    expect(canViewProject({ access: "member" }, "none")).toBe(false);
    expect(canViewProject({ access: "member" }, "member")).toBe(true);
});

test("unsafe links and unsupported image sources cannot be saved", () => {
    for (const url of ["javascript:alert(1)", "data:text/html,test", "//evil.test", "/\\evil.test", "https://test.com\n"]) expect(safeLink(url)).toBe(false);
    for (const url of ["https://example.com/a?x=1", "/projects/story", "mailto:hi@example.com", "#challenge"]) expect(safeLink(url)).toBe(true);
    expect(safeImage("https://untrusted.test/image.jpg")).toBe(false);
    const project = blankProject(); project.name = "Story"; project.id = "story";
    project.data.main.blocks = [{ id: "cta", type: "button", label: "Read", href: "javascript:alert(1)", newTab: false }];
    expect(() => validateProject(project)).toThrow("valid web");
});

test("buttons, coloured cards and videos survive a JSON round-trip", () => {
    const project = blankProject(); project.id = "example"; project.name = "Example";
    project.data.main.blocks = [
        { id: "cta", type: "button", label: "Read more", href: "https://example.com", newTab: true },
        { id: "outcomes", type: "cards", cards: [{ id: "one", value: "99.1%", text: "Satisfaction", colour: "purple" }], caption: "*Research results*" },
        { id: "film", type: "video", url: "/film.mp4", poster: "/poster.jpg", caption: "A short film", title: "Demo", subtitles: "/captions.vtt" },
    ];
    const saved = JSON.parse(JSON.stringify(project));
    expect(() => validateProject(saved)).not.toThrow();
    expect(storyBlocks(saved)).toEqual(project.data.main.blocks);
    saved.data.main.blocks.push({ ...saved.data.main.blocks[0] });
    expect(() => validateProject(saved)).toThrow("unique ID");
});

test("uploads reject unsupported types and excessive sizes", () => {
    expect(validateMedia("video", "video/mp4", 80 * 1024 * 1024)).toBe("mp4");
    expect(validateMedia("video", "video/webm", 1024)).toBe("webm");
    expect(() => validateMedia("video", "video/mp4", 251 * 1024 * 1024)).toThrow("250 MB");
    expect(() => validateMedia("image", "image/svg+xml", 200)).toThrow();
    expect(() => validateMedia("video", "text/html", 200)).toThrow();
    expect(() => validateMedia("subtitles", "text/vtt", 0)).toThrow();
});

test("new stories start hidden and block identifiers stay unique", () => {
    expect(blankProject().hidden).toBe(true);
    expect(newBlock("cards").id).not.toBe(newBlock("cards").id);
});
