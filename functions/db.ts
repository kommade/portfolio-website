import "server-only";
import { Redis } from "@upstash/redis";
import { cacheTag } from "next/cache";
import type { ProjectRecord } from "@/lib/project-content";
import { isHidden } from "@/lib/project-content";
const redis = Redis.fromEnv();
export const getAllProjects = async () => {
    "use cache";
    cacheTag("projects" );
    return await redis.keys("project:*");
}


export const getProjectId = async (key: string) => {
    "use cache";
    cacheTag("projects" );
    const id = await redis.hget(key, "id") as string;
    return { success: true, data: id };
}


export const getAllProjectIds = async () => {
    "use cache";
    cacheTag("projects" );
    const keys = await getAllProjects();
    const records = await Promise.all(keys.map(getProjectThumbnail));
    return records.flatMap(record => record.data && !isHidden(record.data.hidden) && typeof record.data.id === "string" ? [record.data.id] : []);
}


export const getProjectKey = async (id: string | Promise<string>) => {
    "use cache";
    cacheTag("projects" );
    if (typeof id === "object") {
        id = await id;
    }
    if (!/^[a-z0-9][a-z0-9-]{0,79}$/.test(id) || await redis.type(id) !== "string") return { success: false, message: "Project does not exist" };
    const projectKey = await redis.get(id);
    if (typeof projectKey === "string" && projectKey.startsWith("project:")) {
        return { success: true, data: projectKey as string };
    }
    return { success: false, message: "Project does not exist" };
}


export const getProjectThumbnail = async (projectKey: string) => {
    "use cache";
    cacheTag("projects" );
    const data = await redis.hmget(projectKey, ...["name", "desc", "image", "year", "id", "sector", "domain", "hidden", "date_created"]);
    if (data == null) {
        return { success: false };
    }
    return { success: true, data: data };
}



export const getProjectData = async (projectKey: string) => {
    "use cache";
    cacheTag("projects" );
    const data = await redis.hmget(projectKey, ...["name", "year", "data", "access", "id", "desc", "image", "sector", "domain", "hidden", "revision", "date_created"]);
    if (data && data.data && typeof data.data === "string") {
        const serialized = data.data;
        try { data.data = JSON.parse(serialized); }
        catch { data.data = JSON.parse(serialized.replaceAll("&quot", "\"")); }
    }
    if (!data?.data) return { success: false, data: null };
    return { success: true, data: { ...data, name: String(data.name || ""), year: String(data.year || ""), desc: String(data.desc || ""), image: String(data.image || ""), sector: String(data.sector || ""), domain: String(data.domain || ""), hidden: isHidden(data.hidden), revision: Number(data.revision || 0) } as unknown as ProjectRecord };
}


export const getFunStuff = async () => {
    "use cache";
    cacheTag("explorations" );
    const sketchData = await getAllCategoryData(await redis.keys("sketchbook*"));
    const photogData = (await getAllCategoryData(await redis.keys("photography*")));
    const craftData = await getAllCategoryData(await redis.keys("craft*"));
    const interactionData = await getAllCategoryData(await redis.keys("interaction:*"));
    return {
        data: {
            sketchbook: sketchData.data,
            photography: photogData.data.reverse(),
            craft: craftData.data,
            interaction: interactionData.data
        },
        success: sketchData.success && photogData.success && craftData.success && interactionData.success
    };
}

export const getAllCategoryData = async (ids: string[]) => {
    "use cache";
    cacheTag("explorations" );
    let success = true;
    const data = await Promise.all(ids.map(async (id) => {
        const res = await getFunStuffData(id);
        if (!res.success) {
            success = false;
        }
        return {id: id, ...res.data} as { id: string, name: string, url: string } | null;
    }))
    return { success: success, data: data }
}


export const getFunStuffData = async (id: string) => {
    "use cache";
    cacheTag("explorations" );
    const data = await redis.hgetall(id);
    if (data) {
        return { success: true, data: data }
    }
    return { success: false, data: null }
}
