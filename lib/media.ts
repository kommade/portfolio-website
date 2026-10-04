export type MediaKind = "image" | "video" | "subtitles";
export const mediaOrigin = "https://juliette-portfolio-website.s3.ap-southeast-2.amazonaws.com";

export function uploadedMediaKey(value: string): string | null {
    try {
        const url = new URL(value);
        if (url.origin !== mediaOrigin || url.username || url.password) return null;
        const key = decodeURIComponent(url.pathname.slice(1));
        return /^(projects|funstuff)\/.+[^/]$/.test(key) && !/[\\\u0000-\u001f]/.test(key) && !key.split("/").some(part => part === "." || part === "..") ? key : null;
    } catch { return null; }
}

// Include media linked from text/buttons as well as image and video blocks.
function mediaIn(value: unknown, found: Set<string>) {
    if (typeof value === "string") {
        for (const url of value.match(/https:\/\/juliette-portfolio-website\.s3\.ap-southeast-2\.amazonaws\.com\/[^\s<>"'()[\]{}]+/g) || []) {
            const key = uploadedMediaKey(url);
            if (key) found.add(`${mediaOrigin}/${key.split("/").map(encodeURIComponent).join("/")}`);
        }
    } else if (Array.isArray(value)) value.forEach(item => mediaIn(item, found));
    else if (value && typeof value === "object") Object.values(value).forEach(item => mediaIn(item, found));
}

export function projectMediaUrls(record: { image?: unknown; data?: unknown }, includeLegacy = false): string[] {
    let data = record.data;
    if (typeof data === "string" && data) {
        const serialized = data;
        try { data = JSON.parse(serialized); }
        catch {
            const legacy = serialized.replaceAll("&quot", '"');
            try { data = JSON.parse(legacy); }
            catch {
                if (!includeLegacy) throw new Error("Cannot inspect project media.");
                // A deleted/replaced record may be malformed. Collect candidates from
                // its raw text; current records must still parse before any deletion.
                data = legacy;
            }
        }
    }
    if (!includeLegacy && data && (typeof data !== "object" || !("main" in data))) throw new Error("Cannot inspect project media.");
    const main = data ? (data as { main: { blocks?: unknown[] } }).main : undefined;
    // Legacy copies are kept for compatibility, but no longer displayed once blocks exist.
    const active = !includeLegacy && main && Array.isArray(main.blocks) ? { ...data as object, main: { blocks: main.blocks } } : data;
    const found = new Set<string>();
    mediaIn({ image: record.image, data: active }, found);
    return [...found];
}
export const mediaLimits = { image: 20 * 1024 * 1024, video: 250 * 1024 * 1024, subtitles: 1024 * 1024 };
const mediaTypes: Record<MediaKind, Record<string, string>> = {
    image: { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/gif": "gif", "image/avif": "avif" },
    video: { "video/mp4": "mp4", "video/webm": "webm" },
    subtitles: { "text/vtt": "vtt" },
};
export function validateMedia(kind: MediaKind, type: string, size: number) {
    const extension = mediaTypes[kind]?.[type];
    if (!extension || !Number.isSafeInteger(size) || size < 1 || size > mediaLimits[kind]) throw new Error(kind === "video" ? "Choose an MP4 or WebM video under 250 MB." : kind === "subtitles" ? "Choose a WebVTT (.vtt) file under 1 MB." : "Choose a JPG, PNG, WebP, GIF or AVIF image under 20 MB.");
    return extension;
}
