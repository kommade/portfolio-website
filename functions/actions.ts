"use server";

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import bcrypt from 'bcrypt';
import jwt, { TokenExpiredError } from "jsonwebtoken";
import { Redis } from "@upstash/redis";
import { cookies } from "next/headers";
import { logger } from "./db";
import { ProjectData } from "@/components";
import { Resend } from "resend";
import emailTemplate from "./emailTemplate";
import sizeOf from "image-size";

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
    redis.hset(user.id, { "last": new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Singapore', timeStyle: "medium", dateStyle: "medium" }).format(Date.now())})
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