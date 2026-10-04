"use server";

import { Redis } from "@upstash/redis";
import { revalidatePath, updateTag } from "next/cache";
import { requireAdmin } from "./project-auth";
import { validateProject, type ProjectRecord } from "@/lib/project-content";
import { projectMediaUrls, uploadedMediaKey } from "@/lib/media";
import { cleanupMediaCandidates, validateCleanupUrls } from "./media-cleanup";

const redis = Redis.fromEnv();

// Check ownership, URL uniqueness and revision atomically. Legacy revisions are 0.
const saveScript = `
local exists = redis.call('EXISTS', KEYS[1]) == 1
if ARGV[1] == 'create' and exists then return 'conflict' end
if ARGV[1] == 'update' and not exists then return 'missing' end
if exists and tonumber(redis.call('HGET', KEYS[1], 'revision') or '0') ~= tonumber(ARGV[2]) then return 'conflict' end
if redis.call('EXISTS', KEYS[2]) == 1 then
    if redis.call('TYPE', KEYS[2]).ok ~= 'string' or redis.call('GET', KEYS[2]) ~= KEYS[1] then return 'url' end
end
local oldId = exists and redis.call('HGET', KEYS[1], 'id') or false
local oldData = exists and redis.call('HGET', KEYS[1], 'data') or ''
local oldImage = exists and redis.call('HGET', KEYS[1], 'image') or ''
if oldId and oldId ~= KEYS[2] and redis.call('TYPE', oldId).ok == 'string' and redis.call('GET', oldId) == KEYS[1] then redis.call('DEL', oldId) end
redis.call('HSET', KEYS[1], unpack(ARGV, 4))
if not exists then redis.call('HSET', KEYS[1], 'date_created', ARGV[3]) end
redis.call('SET', KEYS[2], KEYS[1])
return {'ok', oldData, oldImage}`;

export async function saveProject(projectKey: string | null, value: ProjectRecord, draftMedia: string[] = []) {
    try {
        await requireAdmin();
        validateProject(value);
        validateCleanupUrls(draftMedia);
        if (projectKey && !/^project:[\w-]+$/.test(projectKey)) throw new Error("Invalid project.");
        const key = projectKey || `project:${crypto.randomUUID()}`;
        const revision = value.revision + 1;
        const result = await redis.eval(saveScript, [key, value.id], [projectKey ? "update" : "create", value.revision, new Date().toISOString(),
            "id", value.id, "name", value.name.trim(), "year", value.year, "desc", value.desc, "image", value.image,
            "sector", value.sector, "domain", value.domain, "access", value.access, "hidden", value.hidden ? "1" : "0",
            "data", JSON.stringify(value.data), "revision", revision]);
        if (!Array.isArray(result) || result[0] !== "ok") throw new Error(result === "url" ? "That page URL is already in use." : result === "missing" ? "This story was deleted. Copy your edits before leaving." : "This story changed in another window. Copy your edits and reload before saving.");
        updateTag("projects");
        revalidatePath("/projects", "layout");
        const currentKeys = new Set(projectMediaUrls(value).map(uploadedMediaKey));
        const removedMedia = [...projectMediaUrls({ data: result[1], image: result[2] }, true), ...draftMedia].filter(url => !currentKeys.has(uploadedMediaKey(url)));
        const cleanupPending = await cleanupMediaCandidates(removedMedia);
        return { success: true as const, id: value.id, projectKey: key, revision, cleanupPending };
    } catch (error) {
        return { success: false as const, message: error instanceof Error ? error.message : "Unable to save this story. Please try again." };
    }
}

export async function setProjectHidden(id: string, hidden: boolean) {
    try {
        await requireAdmin();
        if (typeof id !== "string" || !/^[a-z0-9][a-z0-9-]{0,79}$/.test(id) || typeof hidden !== "boolean") throw new Error("Invalid project.");
        const result = await redis.eval(`
            if redis.call('TYPE', KEYS[1]).ok ~= 'string' then return 0 end
            local key = redis.call('GET', KEYS[1])
            if not key or string.sub(key,1,8) ~= 'project:' or redis.call('HGET',key,'id') ~= KEYS[1] then return 0 end
            redis.call('HSET',key,'hidden',ARGV[1])
            redis.call('HINCRBY',key,'revision',1)
            return 1`, [id], [hidden ? "1" : "0"]);
        if (!result) throw new Error("This story no longer exists.");
        updateTag("projects");
        revalidatePath("/projects", "layout");
        return { success: true as const };
    } catch (error) { return { success: false as const, message: error instanceof Error ? error.message : "Unable to change visibility." }; }
}

export async function deleteProject(id: string) {
    try {
        await requireAdmin();
        if (typeof id !== "string" || !/^[a-z0-9][a-z0-9-]{0,79}$/.test(id)) throw new Error("Invalid project.");
        const result = await redis.eval(`
            if redis.call('TYPE',KEYS[1]).ok ~= 'string' then return 0 end
            local key = redis.call('GET',KEYS[1])
            if not key or string.sub(key,1,8) ~= 'project:' or redis.call('HGET',key,'id') ~= KEYS[1] then return 0 end
            local data = redis.call('HGET',key,'data') or ''
            local image = redis.call('HGET',key,'image') or ''
            redis.call('DEL',key,KEYS[1])
            return {data,image}`, [id], []);
        if (!result) throw new Error("This story no longer exists.");
        updateTag("projects");
        revalidatePath("/projects", "layout");
        const cleanupPending = await cleanupMediaCandidates(projectMediaUrls({ data: (result as string[])[0], image: (result as string[])[1] }, true));
        return { success: true as const, cleanupPending };
    } catch (error) { return { success: false as const, message: error instanceof Error ? error.message : "Unable to delete this story." }; }
}
