"use cache"

import { S3Client, DeleteObjectCommand, DeleteObjectsCommand } from "@aws-sdk/client-s3";
import { ProjectData } from "@/app/projects/[id]/page-client";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv()

const Bucket = process.env.AMPLIFY_BUCKET as string;
const s3 = new S3Client({
    region: process.env.AWS_REGION as string,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string
    }
});

export async function logger(methodName: string, redisFunction: string, key: string) {
    const logLine = {
        redisFunction: redisFunction,
        arg: key,
        initiator: methodName,
        time: new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Singapore', timeStyle: "medium", dateStyle: "medium" }).format(new Date())
    }
    redis.rpush('log', JSON.stringify(logLine))
}

export const getAllProjects = async () => {
    return await redis.keys("project:*");
}

export const getProjectId = async (key: string) => {
    const id = await redis.hget(key, "id") as string;
    return { success: true, data: id };
}

export const getAllProjectIds = async () => {
    const keys = await getAllProjects();
    return await Promise.all(keys.map(async (key) => {
        return (await getProjectId(key)).data;
    }))
}

export const getProjectKey = async (id: string | Promise<string>) => {
    if (typeof id === "object") {
        id = await id;
    }
    const projectKey = await redis.get(id);
    if (projectKey) {
        return { success: true, data: projectKey as string };
    }
    return { success: false, message: "Project does not exist" };
}

export const getProjectThumbnail = async (projectKey: string) => {
    const data = await redis.hmget(projectKey, ...["name", "desc", "image", "year", "id"]);
    if (data == null) {
        return { success: false };
    }
    return { success: true, data: data };
}


export const changeProjectDesc = async (projectKey: string, desc: string) => {
    if (await redis.exists(projectKey)) {
        logger('changeProjectDesc', 'HSET', projectKey);
        await redis.hset(projectKey, { "desc": desc });
        return { success: true };
    } else {
        return { success: false, message: "Key does not exist" };
    }
}

export const changeProjectThumbnail = async (projectKey: string, url: string) => {
    if (await redis.exists(projectKey)) {
        logger('changeProjectThumbnail', 'HSET', projectKey);
        await redis.hset(projectKey, { "image": url });
        return { success: true };
    } else {
        return { success: false, message: "Key does not exist" };
    }
}

export const getProjectData = async (projectKey: string) => {
    const data = await redis.hmget(projectKey, ...["name", "year", "data", "access"]);
    if (data && data.data && typeof data.data === "string") {
        data.data = JSON.parse(data.data.replaceAll("&quot", "\""))
    }
    return { success: true, data: data as unknown as ProjectData };
}

export const saveNewProjectData = async (projectKey: string, data: ProjectData) => {
    logger('saveNewProjectData', 'HMSET', projectKey);
    if (await redis.exists(projectKey)) {
        await redis.hmset(projectKey, { "name": data.name, "year": data.year, "data": JSON.stringify(data.data).replaceAll("\"", "&quot")});
        return { success: true };
    } else {
        return { success: false, message: "Key does not exist" };
    }
}


export const deleteUnusedImages = async (images: string[]) => {
    try {
        for (const image of images) {
            const key = image.split("projects/")[1];
            await s3.send(new DeleteObjectCommand({ Bucket: Bucket, Key: `projects/${key}` }));
        }
        return { success: true };
    } catch (error) {
        return { success: false, message: "Failed to delete images" };
    }
}



export const changeProjectSettings = async (projectKey: string, id: string, data: ProjectData, settings: { id: string, imageNumber: number, grid: boolean, access: "member" | "public" }) => {
    const newSettings: { id?: string, access?: "member" | "public", data?: string } = { id: settings.id, access: settings.access, data: "" };
    let nonCoverImageNumber = settings.imageNumber - 1;
    try {        
        if (await redis.exists(projectKey)) {
            // Delete unchanged data
            if (id !== settings.id) {
                if (await redis.exists(settings.id!)) {
                    return { success: false, message: "ID already exists" };
                }
                logger('changeProjectSettings', 'RENAME', id);
                await redis.rename(id, settings.id!);
            } else {
                delete newSettings.id;
            }
            if (data.access === settings.access) {
                delete newSettings.access;
            }
            // if grid is changed, or if the legnth is different
            if (data.data.main.body.grid.use !== settings.grid || data.data.main.body.normal.length !== nonCoverImageNumber - (settings.grid ? 4 : 0)) {
                if (settings.grid) {
                    nonCoverImageNumber = nonCoverImageNumber - 4;
                    data.data.main.body.grid.images = Array(4).fill("https://via.placeholder.com/800x800");
                    data.data.main.body.grid.use = true;
                } else {
                    data.data.main.body.grid.images = Array(4).fill("");
                    data.data.main.body.grid.use = false;
                }
            } else {
                delete newSettings.data;
            }
        }
        // if longer, delete the extra images
        if (data.data.main.body.normal.length > nonCoverImageNumber) {
            const images = data.data.main.body.normal.slice(nonCoverImageNumber);
            data.data.main.body.normal = data.data.main.body.normal.slice(0, nonCoverImageNumber);
            await deleteUnusedImages(images.map((image) => image.image));
        } else { // if shorter, add placeholders
            data.data.main.body.normal = data.data.main.body.normal.concat(Array(nonCoverImageNumber - data.data.main.body.normal.length).fill({
                header: "",
                text: "",
                image: "https://via.placeholder.com/800x800"
            }));
        }
        if (newSettings.data !== undefined) {
            newSettings.data = JSON.stringify(data.data).replaceAll("\"", "&quot");
        }
        logger('changeProjectSettings', 'HMSET', projectKey);
        await redis.hmset(projectKey, newSettings);
        return { success: true };
    } catch (error) {
        return { success: false, message: "Failed to change project settings" };
    }
}




export const getFunStuff = async () => {
    const sketchData = await getAllCategoryData(await redis.keys("sketchbook*"));
    const photogData = (await getAllCategoryData(await redis.keys("photography*")));
    const craftData = await getAllCategoryData(await redis.keys("craft*"));
    return {
        data: {
            sketchbook: sketchData.data,
            photography: photogData.data.reverse(),
            craft: craftData.data
        },
        success: sketchData.success && photogData.success && craftData.success
    };
}
export const getAllCategoryData = async (ids: string[]) => {
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
    const data = await redis.hgetall(id);
    if (data) {
        return { success: true, data: data }
    }
    return { success: false, data: null }
}



export const updateFunStuffName = async (id:string, desc: string) => {
    if (await redis.exists(id)) {
        logger('updateFunStuffName', 'HSET', id);
        await redis.hset(id, { "name": desc })
        return { success: true }
    }
    return { success: false, message: "Key does not exist" }
}

export const deleteItem = async (key: string) => {
    const res = await redis.exists(key);
    if (res === 0) {
        return { success: false, message: "Key does not exist" }
    } else {
        try {
            if (key.startsWith("project:")) {
                const projectId = await redis.hget(key, "id");
                if (projectId&& typeof projectId === "string") {
                    const folderKey = `projects/${projectId}`;
                    await s3.send(new DeleteObjectsCommand({
                        Bucket: Bucket,
                        Delete: {
                            Objects: [{ Key: folderKey }],
                            Quiet: true
                        }
                    }));
                    await redis.del(projectId);
                }
            } else if (key.startsWith("photography:") || key.startsWith("sketchbook:") || key.startsWith("craft:")) {
                const funstuffData = await redis.hget(key, "url");
                if (funstuffData && typeof funstuffData === "string" && funstuffData.startsWith("https://juliette-portfolio-website.s3.ap-southeast-2.amazonaws.com/")) {
                    const id = funstuffData.split("funstuff/")[1];
                    await s3.send(new DeleteObjectCommand({ Bucket: Bucket, Key: `funstuff/${id}` }));
                }
            } else {
                return { success: false, message: "Cannot delete this key" }
            }
            logger('deleteItem', 'del', key)
            await redis.del(key);
        } catch (error) {
            return { success: false, message: "Failed to delete item" }
        }
        return { success: true }
    }
}