export const cardColours = ["sage", "grape", "purple", "brick"] as const;
export type CardColour = typeof cardColours[number];
export type StoryImage = { url: string; alt: string; caption: string };
export type StoryCard = { id: string; value: string; text: string; colour: CardColour };
export type StoryBlock = { id: string } & (
    | { type: "heading"; text: string }
    | { type: "text"; text: string }
    | { type: "image"; image: StoryImage }
    | { type: "gallery"; images: StoryImage[] }
    | { type: "video"; url: string; poster: string; caption: string; title: string; subtitles: string }
    | { type: "button"; label: string; href: string; newTab: boolean }
    | { type: "cards"; cards: StoryCard[]; caption: string }
);

export interface ProjectData {
    name: string;
    year: string;
    access: "member" | "public";
    hidden?: boolean;
    data: {
        sidebar: { "project-type": string[]; team: string[]; skillset: string[]; approach: string[]; labels?: { team: string; skillset: string; approach: string } };
        main: {
            cover: { image: string; text: string };
            body: { normal: { image: string; header: string; text: string }[]; grid: { use: boolean; images: string[]; header: string; text: string } };
            blocks?: StoryBlock[];
        };
    };
}

export type ProjectRecord = ProjectData & { id: string; desc: string; image: string; sector: string; domain: string; hidden: boolean; revision: number };
export const isHidden = (value: unknown) => value === true || value === "true" || value === 1 || value === "1";
export const canViewProject = (project: { hidden?: unknown; access?: unknown }, role: string) =>
    (!isHidden(project.hidden) || role === "admin") && (project.access !== "member" || role === "member" || role === "admin");

export function safeLink(value: string): boolean {
    if (!value || /[\s\\\u0000-\u001f]/.test(value)) return false;
    if (/^\/(?!\/)/.test(value) || /^#[\w-]+$/.test(value)) return true;
    try { return ["https:", "http:", "mailto:"].includes(new URL(value).protocol); } catch { return false; }
}

export function safeImage(value: string): boolean {
    if (!value) return true;
    if (/^\/(?!\/)/.test(value) && !/[\\\u0000-\u001f]/.test(value)) return true;
    try {
        const url = new URL(value);
        return url.protocol === "https:" && ["images.unsplash.com", "juliette-portfolio-website.s3.ap-southeast-2.amazonaws.com", "via.placeholder.com"].includes(url.hostname);
    } catch { return false; }
}

export function safeVideo(value: string): boolean {
    if (!value) return true;
    if (/^\/(?!\/)/.test(value) && !/[\\\u0000-\u001f]/.test(value)) return true;
    try { const url = new URL(value); return url.protocol === "https:" && url.hostname === "juliette-portfolio-website.s3.ap-southeast-2.amazonaws.com"; } catch { return false; }
}

export function blankProject(): ProjectRecord {
    return { id: "", name: "", year: "", desc: "", image: "", sector: "", domain: "", access: "public", hidden: true, revision: 0,
        data: { sidebar: { "project-type": [], team: [], skillset: [], approach: [], labels: { team: "Client", skillset: "My Role", approach: "Methods" } },
            main: { cover: { image: "", text: "" }, body: { normal: [], grid: { use: false, images: [], header: "", text: "" } }, blocks: [] } } };
}

export function newBlock(type: StoryBlock["type"]): StoryBlock {
    const id = crypto.randomUUID();
    switch (type) {
        case "heading": return { id, type, text: "New section" };
        case "text": return { id, type, text: "" };
        case "image": return { id, type, image: { url: "", alt: "", caption: "" } };
        case "gallery": return { id, type, images: [{ url: "", alt: "", caption: "" }, { url: "", alt: "", caption: "" }] };
        case "video": return { id, type, url: "", poster: "", caption: "", title: "", subtitles: "" };
        case "button": return { id, type, label: "View more", href: "", newTab: true };
        case "cards": return { id, type, caption: "", cards: [{ id: crypto.randomUUID(), value: "", text: "", colour: "sage" }] };
    }
}

// Convert in memory only. Existing Redis records and their original fields stay intact.
export function storyBlocks(project: ProjectData): StoryBlock[] {
    if (project.data.main.blocks) return project.data.main.blocks;
    const { cover, body } = project.data.main;
    const blocks: StoryBlock[] = [];
    const section = (id: string, heading: string, text: string, image: string) => {
        if (heading) blocks.push({ id, type: "heading", text: heading });
        if (text) blocks.push({ id: `${id}-text`, type: "text", text: text.replace(/<br\s*\/?>/gi, "\n").replace("Click here to view the full thesis book.", "Click [here](https://www.yumpu.com/en/document/view/68308775/window-to-another-world-spreads) to view the full thesis book.") });
        if (image) blocks.push({ id: `${id}-image`, type: "image", image: { url: image, alt: heading || project.name, caption: "" } });
    };
    section("challenge", "The Challenge", cover.text, cover.image);
    body.normal.forEach((item, index) => section(`section-${index}`, item.header, item.text, item.image));
    if (body.grid.use) {
        section("gallery", body.grid.header, body.grid.text, "");
        blocks.push({ id: "gallery-images", type: "gallery", images: body.grid.images.filter(Boolean).map(url => ({ url, alt: body.grid.header || project.name, caption: "" })) });
    }
    return blocks;
}

// This schema is also checked on the server; client validation is only a convenience.
export function validateProject(value: unknown): asserts value is ProjectRecord {
    const fail = (message: string): never => { throw new Error(message); };
    const obj = (v: unknown): Record<string, unknown> => v !== null && typeof v === "object" && !Array.isArray(v) ? v as Record<string, unknown> : fail("Invalid story data.");
    const text = (v: unknown, max = 20000): v is string => typeof v === "string" && v.length <= max;
    const arr = (v: unknown, max = 200): unknown[] => Array.isArray(v) && v.length <= max ? v : fail("Too many items in this story.");
    const strings = (v: unknown) => arr(v).every(item => text(item, 2000));
    const p = obj(value);
    if (!text(p.id, 80) || !/^[a-z0-9][a-z0-9-]*$/.test(p.id)) fail("Use a page URL with lowercase letters, numbers and hyphens.");
    if (!text(p.name, 300) || !p.name.trim()) fail("Add a story title.");
    for (const key of ["year", "desc", "sector", "domain"]) if (!text(p[key], key === "desc" ? 4000 : 300)) fail(`Invalid ${key}.`);
    if (!text(p.image, 2048) || !safeImage(p.image as string)) fail("Use an uploaded image or a supported image URL.");
    if (!["member", "public"].includes(p.access as string) || typeof p.hidden !== "boolean") fail("Invalid visibility settings.");
    if (!Number.isSafeInteger(p.revision) || (p.revision as number) < 0) fail("Invalid story revision.");
    const data = obj(p.data), sidebar = obj(data.sidebar), main = obj(data.main), cover = obj(main.cover), body = obj(main.body), grid = obj(body.grid);
    for (const key of ["project-type", "team", "skillset", "approach"]) if (!strings(sidebar[key])) fail("Invalid overview text.");
    if (sidebar.labels) for (const label of Object.values(obj(sidebar.labels))) if (!text(label, 60)) fail("Overview labels must be under 60 characters.");
    if (!text(cover.image, 2048) || !text(cover.text) || !text(grid.header, 300) || !text(grid.text) || typeof grid.use !== "boolean" || !strings(grid.images)) fail("Invalid original story content.");
    for (const item of arr(body.normal)) { const s = obj(item); if (!text(s.image, 2048) || !text(s.header, 300) || !text(s.text)) fail("Invalid original story section."); }
    const image = (value: unknown) => { const i = obj(value); if (!text(i.url, 2048) || !safeImage(i.url as string) || !text(i.alt, 1000) || !text(i.caption, 4000)) fail("Invalid image. Upload a file or use a supported URL."); };
    const ids = new Set();
    for (const value of arr(main.blocks, 150)) {
        const b = obj(value);
        if (!text(b.id, 100) || !/^[\w-]+$/.test(b.id) || ids.has(b.id)) fail("Each content block needs a unique ID.");
        ids.add(b.id);
        switch (b.type) {
            case "heading": if (!text(b.text, 300) || !b.text.trim()) fail("Add a section heading."); break;
            case "text": if (!text(b.text)) fail("A text block is too long."); break;
            case "image": image(b.image); break;
            case "gallery": arr(b.images, 12).forEach(image); break;
            case "video": if (!text(b.url, 2048) || !safeVideo(b.url) || !text(b.poster, 2048) || !safeImage(b.poster) || !text(b.title, 300) || !text(b.caption, 4000) || !text(b.subtitles, 2048) || !safeVideo(b.subtitles)) fail("Invalid video or poster URL."); break;
            case "button": if (!text(b.label, 150) || !b.label.trim() || !text(b.href, 2048) || !safeLink(b.href) || typeof b.newTab !== "boolean") fail("Add a button label and a valid web, email or page link."); break;
            case "cards": {
                const cards = arr(b.cards, 8), cardIds = new Set();
                if (!cards.length || !text(b.caption, 4000)) fail("Add at least one card.");
                for (const value of cards) { const c = obj(value); if (!text(c.id, 100) || cardIds.has(c.id) || !text(c.value, 100) || !text(c.text, 2000) || !cardColours.includes(c.colour as CardColour)) fail("Invalid card content or colour."); cardIds.add(c.id); }
                break;
            }
            default: fail("Unknown content block.");
        }
    }
    if (JSON.stringify(p).length > 500000) fail("This story is too large. Split long text into shorter stories.");
}
