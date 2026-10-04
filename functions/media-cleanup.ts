import "server-only";
import { DeleteObjectsCommand, S3Client } from "@aws-sdk/client-s3";
import { Redis } from "@upstash/redis";
import { mediaOrigin, projectMediaUrls, uploadedMediaKey } from "@/lib/media";

const redis = Redis.fromEnv();

export function validateCleanupUrls(value: unknown): asserts value is string[] {
    if (!Array.isArray(value) || value.length > 2500 || value.some(url => typeof url !== "string" || url.length > 2048 || !uploadedMediaKey(url))) throw new Error("Invalid uploaded files.");
}

// Never use cached project reads when deciding whether a stored file is still needed.
export async function cleanupMediaCandidates(urls: string[]): Promise<string[]> {
    const candidates = new Map(urls.flatMap(url => { const key = uploadedMediaKey(url); return key ? [[key, `${mediaOrigin}/${key.split("/").map(encodeURIComponent).join("/")}`] as const] : []; }));
    if (!candidates.size) return [];
    try {
        const projectKeys = await redis.keys("project:*");
        const projects = await Promise.all(projectKeys.map(key => redis.hmget(key, "image", "data")));
        const referenced = new Set(projects.flatMap(project => project ? projectMediaUrls(project).map(uploadedMediaKey) : []));
        const explorationKeys = (await Promise.all(["photography:*", "sketchbook:*", "craft:*", "interaction:*"].map(pattern => redis.keys(pattern)))).flat();
        const explorations = await Promise.all(explorationKeys.map(key => redis.hget<string>(key, "url")));
        explorations.forEach(url => { if (typeof url === "string") referenced.add(uploadedMediaKey(url)); });
        for (const key of referenced) if (key) candidates.delete(key);
        if (!candidates.size) return [];
        const s3 = new S3Client({ region: process.env.AWS_REGION, credentials: { accessKeyId: process.env.AWS_ACCESS_KEY_ID!, secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY! } });
        const keys = [...candidates.keys()];
        for (let offset = 0; offset < keys.length; offset += 1000) {
            const batch = keys.slice(offset, offset + 1000);
            const result = await s3.send(new DeleteObjectsCommand({ Bucket: process.env.AMPLIFY_BUCKET!, Delete: { Objects: batch.map(Key => ({ Key })), Quiet: true } }));
            const failed = new Set(result.Errors?.map(error => error.Key));
            for (const key of batch) if (!failed.has(key)) candidates.delete(key);
        }
    } catch {
        // Keep failed candidates for an explicit retry; never undo a successfully saved story.
    }
    return [...candidates.values()];
}
