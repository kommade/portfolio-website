import { expect, test } from "bun:test";
import { blankProject, newBlock, storyBlocks, storyImages, validateProject } from "../lib/project-content";
import { mediaOrigin, projectMediaUrls } from "../lib/media";

test("image toggles save both labels and image metadata, and validate both image URLs", () => {
    const project = { ...blankProject(), id: "toggle-story", name: "Toggle story" };
    const toggle = newBlock("image-toggle");
    if (toggle.type !== "image-toggle") throw new Error("Wrong block type");
    toggle.options[0].image = { url: "/before.jpg", alt: "Original design", caption: "First concept" };
    toggle.options[1].image = { url: "/after.jpg", alt: "Updated design", caption: "Final concept" };
    project.data.main.blocks = [toggle];
    const saved = JSON.parse(JSON.stringify(project));
    expect(() => validateProject(saved)).not.toThrow();
    expect(storyBlocks(saved)).toEqual([toggle]);
    saved.data.main.blocks[0].options[1].image.url = "https://untrusted.test/after.jpg";
    expect(() => validateProject(saved)).toThrow("Invalid image");
    saved.data.main.blocks[0].options[1].image.url = "/after.jpg";
    saved.data.main.blocks[0].options[1].label = " ";
    expect(() => validateProject(saved)).toThrow("label");
    saved.data.main.blocks[0].options.pop();
    expect(() => validateProject(saved)).toThrow("exactly two");
});

test("the viewer includes both toggle states and identifies duplicate image occurrences independently", () => {
    const image = { url: "/shared.jpg", alt: "Shared image", caption: "" };
    const images = storyImages([
        { id: "single", type: "image", image },
        { id: "toggle", type: "image-toggle", options: [{ label: "Before", image }, { label: "After", image: { ...image, alt: "After image" } }] },
        { id: "gallery", type: "gallery", images: [{ ...image, url: "" }, image] },
    ]);
    expect(images.map(image => image.id)).toEqual(["single-image-0", "toggle-image-0", "toggle-image-1", "gallery-image-1"]);
    expect(images[2].alt).toBe("After image");
});

test("upload cleanup tracks both toggle states even when only one is displayed", () => {
    const project = blankProject();
    project.data.main.blocks = [{ id: "toggle", type: "image-toggle", options: [
        { label: "Before", image: { url: `${mediaOrigin}/projects/uploads/before.jpg`, alt: "", caption: "" } },
        { label: "After", image: { url: `${mediaOrigin}/projects/uploads/after.jpg`, alt: "", caption: "" } },
    ] }];
    expect(projectMediaUrls(project)).toEqual([`${mediaOrigin}/projects/uploads/before.jpg`, `${mediaOrigin}/projects/uploads/after.jpg`]);
});
