"use server";

import { kv } from "@vercel/kv";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import { revalidatePath } from "next/cache";

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
    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.SECRET_KEY as string, { expiresIn: '1h'})
    return { success: true, message: token }
}

export async function getProjectData(projectKey: string) {
    if (typeof projectKey !== "string") {
        return { success: false, data: null }
    }
    const data = await kv.hgetall(projectKey);
    return { success: true, data: data};
}
