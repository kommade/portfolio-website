import { uploadedMediaKey } from "./media";

const pending = new Map<string, string[]>();
const storageKey = (id: string) => `portfolio-media-cleanup:${id}`;

export function readPendingMedia(id: string): string[] {
    try {
        const value: unknown = JSON.parse(sessionStorage.getItem(storageKey(id)) || "[]");
        if (Array.isArray(value)) return [...new Set([...(pending.get(id) || []), ...value.filter((url): url is string => typeof url === "string" && Boolean(uploadedMediaKey(url)))])];
    } catch { /* In-memory state still carries retries across client navigation. */ }
    return pending.get(id) || [];
}

export function storePendingMedia(id: string, urls: string[]) {
    pending.set(id, urls);
    try {
        if (urls.length) sessionStorage.setItem(storageKey(id), JSON.stringify(urls));
        else sessionStorage.removeItem(storageKey(id));
    } catch { /* Storage can be unavailable in private browsing. */ }
}
