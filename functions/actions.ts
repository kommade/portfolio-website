"use server";

import { Resend } from "resend";
import { put } from "@vercel/blob";
import { kv } from "@vercel/kv";
import bcrypt from 'bcrypt';
import jwt, { TokenExpiredError } from "jsonwebtoken";
import emailTemplate from "./emailTemplate";
import sizeOf from "image-size";
import { ProjectData } from "@/app/projects/[id]/page";

interface User {
    id: string,
    role: string,
    hash: string,
    last: string,
    [key: string]: unknown;
}

function logger(methodName: string, kvFunction: string, key: string) {
    const logLine = {
        kvFunction: kvFunction,
        arg: key,
        initiator: methodName,
        time: new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Singapore', timeStyle: "medium", dateStyle: "medium" }).format(new Date())
    }
    kv.rpush('log', JSON.stringify(logLine))
}

export async function login(formdata: FormData) {
    const username = formdata.get("username") as string;
    const password = formdata.get("password") as string;
    if (!username || !password) {
        return { success: false, message: "Please fill in the required blanks" };
    }
    const userId = await kv.get(username);
    if (!userId || typeof userId !== "string") {
        return { success: false, message: "Unknown username" };
    }
    const user = (await kv.hgetall(userId)) as User;
    user.id = userId;
    if (!user || typeof user.hash !== "string" || !bcrypt.compareSync(password, user.hash)) {
        return { success: false, message: "Incorrect password" };
    }
    logger('login', 'HSET', user.id)
    kv.hset(user.id, { "last": new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Singapore', timeStyle: "medium", dateStyle: "medium" }).format(new Date())})
    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.SECRET_KEY as string, { expiresIn: '1h'})
    return { success: true, message: token }
}

export async function getAllProjects() {
    return await kv.keys("project:*");
}

export async function getProjectKey(id: string) {
    const projectKey = await kv.get(id);
    return { success: true, data: projectKey };
}

export async function getProjectThumbnail(projectKey: string) {
    const data = await kv.hmget(projectKey, ...["name", "desc", "image", "year", "id"]);
    return { success: true, data: data };
}

export async function getProjectData(projectKey: string) {
    const data = await kv.hmget(projectKey, ...["name", "year", "data"]);
    if (data?.data && typeof data.data === "string") {
        data.data = JSON.parse(data.data.replaceAll("&quot", "\""))
    }
    return { success: true, data: data };
}

export async function saveNewProjectData(projectKey: string, data: ProjectData) {
    logger('saveNewProjectData', 'HMSET', projectKey);
    if (await kv.exists(projectKey)) {
        await kv.hmset(projectKey, { "name": data.name, "year": data.year, "data": JSON.stringify(data.data).replaceAll("\"", "&quot")});
        return { success: true };
    } else {
        return { success: false, message: "Key does not exist" };
    }
}

export async function saveNewProjectImage(formData: FormData) {
    console.log(formData)
    const projectKey = formData.get("key") as string;
    const index = parseInt(formData.get("index") as string);
    const image = formData.get('image') as File;
    try {
        const imageURL = await put(image.name, image, { access: "public" });
        console.log(imageURL)
        logger('saveNewProjectImage', 'HSET', projectKey);
        const prevData = await kv.hget(projectKey, "data") as string;
        if (prevData) {
            const data = JSON.parse(prevData.replaceAll("&quot", "\""));
            data.images[index] = imageURL.url;
            await kv.hset(projectKey, { "data": JSON.stringify(data).replaceAll("\"", "&quot") });
        } else {
            return { success: false, message: "Could not get previous data" };
        }
        return { success: true, data: imageURL.url };
    } catch (error) {
        return { success: false, message: "Failed to upload image", error: (error as Error).message }
    }
}

export async function isAllowedToAccess(token: string | null, pageId: string) {
    let access;
    if (pageId === "admin") {
        access = pageId;
    } else {
        const page = await kv.get(pageId) as string;
        if (!page) {
            return "no";
        }
        access = await kv.hget(page, "access") as string;
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
    const sketchData = await getAllCategoryData(await kv.keys("sketchbook*"));
    const photogData = (await getAllCategoryData(await kv.keys("photography*")));
    const craftData = await getAllCategoryData(await kv.keys("craft*"));
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
    const data = await kv.hgetall(id);
    if (data) {
        return { success: true, data: data }
    }
    return { success: false, data: null }
}

export async function submitNewFunStuff(formData: FormData) {
    const category = formData.get("type")!;
    const keys = await kv.keys(`${category}:*`);
    const nextId = keys.length;
    const image = formData.get('image') as File;
    const sizeof = sizeOf(new Uint8Array(await image.arrayBuffer()));
    if (!sizeof.width || !sizeof.height) {
        return { success: false, message: "Unable to confirm aspect ratio of image" }
    }
    if ((sizeof.width / sizeof.height) < (5 / 7) || (sizeof.width / sizeof.height) > (3 / 2)) {
        return { success: false, message: "Image aspect ratio too small/large" }
    }
    try {
        const imageURL = await put(image.name, image, { access: "public" })
        logger('submitNewFunStuff', 'HSET', `${category}:${nextId}`);
        await kv.hset(`${category}:${nextId}`, {
            name: formData.get("name"),
            url: imageURL.url
        })
    } catch (error) { 
        return { success: false, message: "Failed to upload image" }
    }
    return { success: true }
};

export async function updateFunStuffName(id:string, desc: string) {
    if (await kv.exists(id)) {
        logger('updateFunStuffName', 'HSET', id);
        await kv.hset(id, { "name": desc })
        return { success: true }
    }
    return { success: false, message: "Key does not exist" }
}

export async function deleteItem(id: string) {
    logger('deleteItem', 'del', id)
    const res = await kv.del(id);
    if (res === 0) {
        return { success: false, message: "Key does not exist" }
    } else {
        return { success: true }
    }
}