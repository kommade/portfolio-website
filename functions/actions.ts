"use server";

import { Resend } from "resend";
import { put } from "@vercel/blob";
import { kv } from "@vercel/kv";
import bcrypt from 'bcrypt';
import jwt, { TokenExpiredError } from "jsonwebtoken";
import emailTemplate from "./emailTemplate";
import sizeOf from "image-size";

interface User {
    id: string,
    role: string,
    hash: string,
    last: string,
    [key: string]: unknown;
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
    kv.hset(user.id, { "last": new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Singapore', timeStyle: "medium", dateStyle: "medium" }).format(new Date())})
    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.SECRET_KEY as string, { expiresIn: '1h'})
    return { success: true, message: token }
}

export async function getProjectKey(id: string) {
    if (typeof id !== "string") {
        return { success: false, data: null }
    }
    const projectKey = await kv.get(id);
    return { success: true, data: projectKey };
}

export async function getProjectData(projectKey: string) {
    if (typeof projectKey !== "string") {
        return { success: false, data: null }
    }
    const data = await kv.hgetall(projectKey);
    return { success: true, data: data};
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

export async function getAllProjects() {
    return await kv.keys("project:*");
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
    try {
        await resend.emails.send({
            from: "Contact Form <onboarding@resend.dev>",
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
    // TODO: Error handling
    const imageURL = await put(image.name, image, { access: "public" })
    await kv.hmset(`${category}:${nextId}`, {
        name: formData.get("name"),
        url: imageURL.url
    })
    return { success: true }
};

export async function deleteItem(id: string) {
    const res = await kv.del(id);
    if (res === 0) {
        return { success: false, message: "Key does not exist" }
    } else {
        return { success: true }
    }
}