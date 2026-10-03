export type MediaKind = "image" | "video" | "subtitles";
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
