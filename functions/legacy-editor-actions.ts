"use server";
import { S3Client, DeleteObjectCommand, DeleteObjectsCommand } from "@aws-sdk/client-s3";
import { Redis } from "@upstash/redis";
import type { ProjectData } from "@/lib/project-content";
import { updateTag } from "next/cache";
import { requireAdmin } from "./project-auth";
import { logger } from "./activity";
const redis = Redis.fromEnv();
const Bucket = process.env.AMPLIFY_BUCKET as string;
const s3 = new S3Client({ region: process.env.AWS_REGION, credentials: { accessKeyId: process.env.AWS_ACCESS_KEY_ID!, secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY! } });
export const changeProjectDesc = async (projectKey: string, desc: string) => {
    await requireAdmin();
    if (await redis.exists(projectKey)) {
        logger('changeProjectDesc', 'HSET', projectKey);
        await redis.hset(projectKey, { "desc": desc });
        updateTag("projects"); updateTag("explorations"); return { success: true };
    } else {
        return { success: false, message: "Key does not exist" };
    }
}


export const changeProjectThumbnail = async (projectKey: string, url: string) => {
    await requireAdmin();
    if (await redis.exists(projectKey)) {
        logger('changeProjectThumbnail', 'HSET', projectKey);
        await redis.hset(projectKey, { "image": url });
        updateTag("projects"); updateTag("explorations"); return { success: true };
    } else {
        return { success: false, message: "Key does not exist" };
    }
}


export const saveNewProjectData = async (projectKey: string, data: ProjectData) => {
    await requireAdmin();
    logger('saveNewProjectData', 'HMSET', projectKey);
    if (await redis.exists(projectKey)) {
        await redis.hmset(projectKey, { "name": data.name, "year": data.year, "data": JSON.stringify(data.data).replaceAll("\"", "&quot")});
        updateTag("projects"); updateTag("explorations"); return { success: true };
    } else {
        return { success: false, message: "Key does not exist" };
    }
}



export const deleteUnusedImages = async (images: string[]) => {
    await requireAdmin();
    try {
        for (const image of images) {
            const key = image.split("projects/")[1];
            await s3.send(new DeleteObjectCommand({ Bucket: Bucket, Key: `projects/${key}` }));
        }
        updateTag("projects"); updateTag("explorations"); return { success: true };
    } catch (error) {
        return { success: false, message: "Failed to delete images" };
    }
}




export const changeProjectSettings = async (projectKey: string, id: string, data: ProjectData, settings: { id: string, imageNumber: number, grid: boolean, access: "member" | "public" }) => {
    await requireAdmin();
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
        updateTag("projects"); updateTag("explorations"); return { success: true };
    } catch (error) {
        return { success: false, message: "Failed to change project settings" };
    }
}





export const updateFunStuffName = async (id:string, desc: string) => {
    await requireAdmin();
    if (await redis.exists(id)) {
        logger('updateFunStuffName', 'HSET', id);
        await redis.hset(id, { "name": desc })
        updateTag("projects"); updateTag("explorations"); return { success: true }
    }
    return { success: false, message: "Key does not exist" }
}


export const deleteItem = async (key: string) => {
    await requireAdmin();
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
            } else if (key.startsWith("photography:") || key.startsWith("sketchbook:") || key.startsWith("craft:") || key.startsWith("interaction:")) {
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
        updateTag("projects"); updateTag("explorations"); return { success: true }
    }
}
