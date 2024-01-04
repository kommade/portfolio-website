import { kv } from "@vercel/kv";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const projectKey = req.nextUrl.searchParams.get('projectKey');
    if (typeof projectKey !== "string") {
        return NextResponse.json({ message: "Bad Request "}, { status: 400 })
    }
    const data = await kv.hgetall(projectKey);
    return NextResponse.json(data, { status: 200 });
}