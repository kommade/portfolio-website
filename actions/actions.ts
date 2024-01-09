"use server";

import { put } from "@vercel/blob";
import { kv } from "@vercel/kv";
import bcrypt from 'bcrypt';
import jwt, { TokenExpiredError } from "jsonwebtoken";

interface User {
    id: string,
    role: string,
    hash: string,
    last: string,
    [key: string]: unknown;
}

export async function submit(formData: FormData) {
    const keys = await kv.keys("project:*");
    const nextId = keys.length;
    const image = formData.get("image") as File;
    const imageURL = await put(image.name, image, { access: "public"})
    await kv.hmset(`project:${nextId}`, {
        name: formData.get("title"),
        desc: formData.get("desc"),
        image: imageURL.url
    })
    return { success: true }
};

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