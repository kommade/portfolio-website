"use server";

import { Resend } from "resend";
import { S3Client, PutObjectCommand, DeleteObjectCommand, DeleteObjectsCommand } from "@aws-sdk/client-s3";
import bcrypt from 'bcrypt';
import jwt, { TokenExpiredError } from "jsonwebtoken";
import emailTemplate from "./emailTemplate";
import sizeOf from "image-size";
import { ProjectData } from "@/app/projects/[id]/page-client";
import { Redis } from "@upstash/redis";
import { unstable_cache as cache } from "next/cache";
import { cookies } from "next/headers";

const redis = Redis.fromEnv()
const revalidate = 60;

interface User {
    id: string,
    role: string,
    hash: string,
    last: string,
    [key: string]: unknown;
}

const Bucket = process.env.AMPLIFY_BUCKET as string;
const s3 = new S3Client({
    region: process.env.AWS_REGION as string,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string
    }
});

function logger(methodName: string, redisFunction: string, key: string) {
    const logLine = {
        redisFunction: redisFunction,
        arg: key,
        initiator: methodName,
        time: new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Singapore', timeStyle: "medium", dateStyle: "medium" }).format(new Date())
    }
    redis.rpush('log', JSON.stringify(logLine))
}

export const login = async (formdata: FormData) => {
    const username = formdata.get("username") as string;
    const password = formdata.get("password") as string;
    if (!username || !password) {
        return { success: false, message: "Please fill in the required blanks" };
    }
    const users = await redis.lrange("users", 0, -1);
    if (!users.includes(username)) {
        return { success: false, message: "Unknown username" };
    }
    const user = (await redis.hgetall(username)) as User;
    user.id = username;
    if (!user || typeof user.hash !== "string" || !bcrypt.compareSync(password, user.hash)) {
        return { success: false, message: "Incorrect password" };
    }
    logger('login', 'HSET', user.id)
    redis.hset(user.id, { "last": new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Singapore', timeStyle: "medium", dateStyle: "medium" }).format(new Date())})
    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.SECRET_KEY as string, { expiresIn: '1h' });
    (await cookies()).set('token', token, {
        maxAge: 3600,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
    })
    return { success: true }
}

export const logout = async () => {
    (await cookies()).delete('token');
    return { success: true }
}

export const getAllProjects = cache(
    async () => {
        return await redis.keys("project:*");
    }, undefined, { revalidate }
)

export const getProjectId = cache(
    async (key: string) => {
        const id = await redis.hget(key, "id") as string;
        return { success: true, data: id };
    }, undefined, { revalidate }
)

export const getAllProjectIds = cache(
    async () => {
        const keys = await getAllProjects();
        return await Promise.all(keys.map(async (key) => {
            return (await getProjectId(key)).data;
        })
    )
}, undefined, { revalidate }
)

export const getProjectKey = cache(
    async (id: string) => {
        const projectKey = await redis.get(id);
        if (projectKey) {
            return { success: true, data: projectKey as string };
        }
        return { success: false, message: "Project does not exist" };
    }, undefined, { revalidate }
)

export const getProjectThumbnail = cache(
    async (projectKey: string) => {
        const data = await redis.hmget(projectKey, ...["name", "desc", "image", "year", "id"]);
        return { success: true, data: data };
    }, undefined, { revalidate }
)

export const uploadNewProjectThumbnail = async (formData: FormData) => {
    const id = formData.get("id") as string;
    const image = formData.get('image') as File;
    const imageBuffer = await image.arrayBuffer();
    const imageBody = Buffer.from(imageBuffer);
    try {
        const res = await s3.send(new PutObjectCommand({
            Bucket: Bucket,
            Key: `projects/${id}/${image.name}`,
            Body: imageBody,
            ContentType: image.type,
            ContentLength: image.size
        }));
        const versionId = res.VersionId;
        return { success: true, data: `https://juliette-portfolio-website.s3.ap-southeast-2.amazonaws.com/projects/${id}/${image.name}?versionID=${versionId}` };
    } catch (error) {
        return { success: false, message: "Failed to upload image", error: (error as Error).message }
    }
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

export const getProjectData = cache(
    async (projectKey: string) => {
        const data = await redis.hmget(projectKey, ...["name", "year", "data", "access"]);
        if (data && data.data && typeof data.data === "string") {
            data.data = JSON.parse(data.data.replaceAll("&quot", "\""))
        }
        return { success: true, data: data as unknown as ProjectData };
    }, undefined, { revalidate }
)

export const saveNewProjectData = async (projectKey: string, data: ProjectData) => {
    logger('saveNewProjectData', 'HMSET', projectKey);
    if (await redis.exists(projectKey)) {
        await redis.hmset(projectKey, { "name": data.name, "year": data.year, "data": JSON.stringify(data.data).replaceAll("\"", "&quot")});
        return { success: true };
    } else {
        return { success: false, message: "Key does not exist" };
    }
}

export const uploadNewProjectImage = async (formData: FormData) => {
    const id = formData.get("id") as string;
    const image = formData.get('image') as File;
    const imageBuffer = await image.arrayBuffer();
    const imageBody = Buffer.from(imageBuffer);
    try {
        const res = await s3.send(new PutObjectCommand({
            Bucket: Bucket,
            Key: `projects/${id}/${image.name}`,
            Body: imageBody,
            ContentType: image.type,
            ContentLength: image.size
        }));
        const versionId = res.VersionId;
        return { success: true, data: `https://juliette-portfolio-website.s3.ap-southeast-2.amazonaws.com/projects/${id}/${image.name}?versionID=${versionId}` };
    } catch (error) {
        return { success: false, message: "Failed to upload image", error: (error as Error).message }
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

export const createNewProject = async (formData: FormData) => {
    const keys = await redis.keys("project:*");
    const nextId = keys.length;
    const projectKey = `project:${nextId}`;
    const id = formData.get("id") as string;
    const image = formData.get('image') as File;
    const imageBuffer = await image.arrayBuffer();
    const imageBody = Buffer.from(imageBuffer);
    const grid = formData.get("grid") as string === "true" ? true : false;
    try {
        const data: ProjectData['data'] = {
            main: {
                cover: {
                    image: "https://via.placeholder.com/800x800",
                    text: ""
                },
                body: {
                    grid: {
                        use: grid,
                        header: "",
                        text: "",
                        images: Array(4).fill(grid ? "https://via.placeholder.com/800x800": ""),
                    },
                    normal: Array(parseInt(formData.get("normal") as string)).fill({
                        header: "",
                        text: "",
                        image: "https://via.placeholder.com/800x800"
                    })
                }
            },
            sidebar: {
                "project-type": ["placeholder"],
                team: ["placeholder"],
                skillset: ["placeholder"],
                approach: ["placeholder"],
            }
        }
        const res = await s3.send(new PutObjectCommand({
            Bucket: Bucket,
            Key: `projects/${id}/${image.name}`,
            Body: imageBody,
            ContentType: image.type,
            ContentLength: image.size
        }));
        logger('createNewProject', 'HMSET', projectKey);
        await redis.hmset(projectKey, {
            "name": formData.get("name"),
            "year": formData.get("year"),
            "desc": formData.get("desc"),
            "id": id,
            "image": `https://juliette-portfolio-website.s3.ap-southeast-2.amazonaws.com/projects/${id}/${image.name}?versionID=${res.VersionId}`,
            "access": formData.get("access"),
            "data": JSON.stringify(data).replaceAll("\"", "&quot")
        });
        await redis.set(id, projectKey);
        return { success: true, message: id };
    } catch (error) {
        return { success: false, message: "Failed to create new project" };
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

export const getRole = async () => {
    const token = (await cookies()).get('token');
    if (!token) {
        return "none";
    }
    try {
        const decoded = jwt.verify(token.value, process.env.SECRET_KEY as string) as { userId: string, role: string };
        return decoded.role as "member" | "admin";
    } catch (error) {
        if (error instanceof TokenExpiredError) {
            return "expired";
        }
        return "none";
    }
}

export const submitContactForm = async (formData : FormData) => {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const response = {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        message: formData.get("message") as string
    }
    if (!response.email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)) {
        return { success: false, message: "email invalid"}
    }
    let fromEmail = "onboarding@resend.dev"
    if (process.env.NODE_ENV === "production") {
        fromEmail = "hi@juliettekhoo.com"
    }
    try {
        await resend.emails.send({
            from: `Contact Form <${fromEmail}>`,
            to: [process.env.CONTACT_FORM_EMAIL_ENDPOINT!],
            subject: "Message from contact form",
            react: emailTemplate(response),
            text: ""
        });
    } catch (error) {
        return { success: false, message: "email failed to send"}
    }
    return { success: true };
}

export const getFunStuff = cache(
    async () => {
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
    }, undefined, { revalidate }
)

export const getAllCategoryData = cache(
    async (ids: string[]) => {
        let success = true;
        const data = await Promise.all(ids.map(async (id) => {
            const res = await getFunStuffData(id);
            if (!res.success) {
                success = false;
            }
            return {id: id, ...res.data} as { id: string, name: string, url: string } | null;
        }))
        return { success: success, data: data }
    }, undefined, { revalidate }
)

export const getFunStuffData = cache(
    async (id: string) => {
        const data = await redis.hgetall(id);
        if (data) {
            return { success: true, data: data }
        }
        return { success: false, data: null }
    }, undefined, { revalidate }
)

export const submitNewFunStuff = async (formData: FormData) => {
    const category = formData.get("type")!;
    const keys = await redis.keys(`${category}:*`);
    const nextId = keys.length;
    const image = formData.get('image') as File;
    const imageBuffer = await image.arrayBuffer();
    const sizeof = sizeOf(new Uint8Array(imageBuffer));
    const imageBody = Buffer.from(imageBuffer);
    if (!sizeof.width || !sizeof.height) {
        return { success: false, message: "Unable to confirm aspect ratio of image" }
    }
    if ((sizeof.width / sizeof.height) < (5 / 7) || (sizeof.width / sizeof.height) > (3 / 2)) {
        return { success: false, message: "Image aspect ratio too small/large" }
    }
    try {
        const res = await s3.send(new PutObjectCommand({
            Bucket: Bucket,
            Key: `funstuff/${category}/${image.name}`,
            Body: imageBody,
            ContentType: image.type,
            ContentLength: image.size
        }));
        logger('submitNewFunStuff', 'HSET', `${category}:${nextId}`);
        await redis.hset(`${category}:${nextId}`, {
            name: formData.get("name"),
            url: `https://juliette-portfolio-website.s3.ap-southeast-2.amazonaws.com/funstuff/${category}/${image.name}?versionID=${res.VersionId}`
        })
    } catch (error) { 
        return { success: false, message: "Failed to upload image" }
    }
    return { success: true }
};

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

function getHostname() {
    if (process.env.NODE_ENV === "development") {
        return "localhost:3000";
    }
    if (process.env.VERCEL_ENV === "production") {
        return process.env.VERCEL_PROJECT_PRODUCTION_URL;
    }
    return process.env.VERCEL_BRANCH_URL;
}

import { parseHTML } from "linkedom";

export const prefetchImagesForURL = async (href: string) => {
    const schema = process.env.NODE_ENV === "development" ? "http" : "https";
    const host = getHostname();
    if (!host) {
        return { ok: false, images: [] };
    }

    const images = [];

    const url = `${schema}://${host}/${href}`;
        const response = await fetch(url);
    if (!response.ok) {
            return { ok: false, images: [] };
        }
        const body = await response.text();
        const { document } = parseHTML(body);
        const imgs = Array.from(document.querySelectorAll("main img"))
            .map((img) => ({
                srcset: img.getAttribute("srcset") || img.getAttribute("srcSet"), // Linkedom is case-sensitive
                sizes: img.getAttribute("sizes"),
                src: img.getAttribute("src"),
                alt: img.getAttribute("alt"),
                loading: img.getAttribute("loading"),
            }))
            .filter((img) => img.src);
        images.push(...imgs);

    return {
        ok: true,
        images,
    }
}