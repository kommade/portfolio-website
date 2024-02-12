"use server";

import { Resend } from "resend";
import { S3Client, PutObjectCommand, DeleteObjectCommand, DeleteObjectsCommand } from "@aws-sdk/client-s3";
import bcrypt from 'bcrypt';
import jwt, { TokenExpiredError } from "jsonwebtoken";
import emailTemplate from "./emailTemplate";
import sizeOf from "image-size";
import { ProjectData } from "@/app/projects/[id]/page";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv()

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

export async function login(formdata: FormData) {
    const username = formdata.get("username") as string;
    const password = formdata.get("password") as string;
    if (!username || !password) {
        return { success: false, message: "Please fill in the required blanks" };
    }
    const userId = await redis.get(username);
    if (!userId || typeof userId !== "string") {
        return { success: false, message: "Unknown username" };
    }
    const user = (await redis.hgetall(userId)) as User;
    user.id = userId;
    if (!user || typeof user.hash !== "string" || !bcrypt.compareSync(password, user.hash)) {
        return { success: false, message: "Incorrect password" };
    }
    logger('login', 'HSET', user.id)
    redis.hset(user.id, { "last": new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Singapore', timeStyle: "medium", dateStyle: "medium" }).format(new Date())})
    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.SECRET_KEY as string, { expiresIn: '1h'})
    return { success: true, message: token }
}

export async function getAllProjects() {
    return await redis.keys("project:*");
}

export async function getProjectKey(id: string) {
    const projectKey = await redis.get(id);
    return { success: true, data: projectKey };
}

export async function getProjectThumbnail(projectKey: string) {
    const data = await redis.hmget(projectKey, ...["name", "desc", "image", "year", "id"]);
    return { success: true, data: data };
}

export async function getProjectData(projectKey: string) {
    const data = await redis.hmget(projectKey, ...["name", "year", "data"]);
    if (data?.data && typeof data.data === "string") {
        data.data = JSON.parse(data.data.replaceAll("&quot", "\""))
    }
    return { success: true, data: data };
}

export async function saveNewProjectData(projectKey: string, data: ProjectData) {
    logger('saveNewProjectData', 'HMSET', projectKey);
    if (await redis.exists(projectKey)) {
        await redis.hmset(projectKey, { "name": data.name, "year": data.year, "data": JSON.stringify(data.data).replaceAll("\"", "&quot")});
        return { success: true };
    } else {
        return { success: false, message: "Key does not exist" };
    }
}

export async function uploadNewProjectImage(formData: FormData) {
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

export async function deleteUnusedImages(images: string[]) {
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

export async function createNewProject(formData: FormData) {
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

export async function isAllowedToAccess(token: string | null, pageId: string) {
    let access;
    if (pageId === "admin") {
        access = pageId;
    } else {
        const page = await redis.get(pageId) as string;
        if (!page) {
            return "no";
        }
        access = await redis.hget(page, "access") as string;
    }
    if (access === "public") {
        return "yes";
    } else if (token === null) {
        return "no";
    }
    let decoded;
    try {
        decoded = jwt.verify(token, process.env.SECRET_KEY as string) as { userId: string, role: string}
    } catch (error) {
        if (error instanceof TokenExpiredError) {
            return "expired";
        } else {
            return "no";
        }
    }
    if (decoded.role === "admin") {
        return "yes";
    } else if (decoded.role === "member" && access !== "admin") {
        return "yes"
    }
    return "no";
}

export async function submitContactForm(formData : FormData) {
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

export async function getFunStuff() {
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

export async function getAllCategoryData(ids: string[]) {
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

export async function getFunStuffData(id: string) {
    const data = await redis.hgetall(id);
    if (data) {
        return { success: true, data: data }
    }
    return { success: false, data: null }
}

export async function submitNewFunStuff(formData: FormData) {
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

export async function updateFunStuffName(id:string, desc: string) {
    if (await redis.exists(id)) {
        logger('updateFunStuffName', 'HSET', id);
        await redis.hset(id, { "name": desc })
        return { success: true }
    }
    return { success: false, message: "Key does not exist" }
}

export async function deleteItem(key: string) {
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