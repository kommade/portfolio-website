import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import jwt, { TokenExpiredError } from "jsonwebtoken" 

export function middleware(request: NextRequest) {
    const token = request.cookies.get("token")
    if (request.nextUrl.pathname === "/new" || request.nextUrl.searchParams.get("edit") === "true") {
        if (!token) {
            return NextResponse.redirect(new URL("/no-access", request.url));
        }
        try {
            const decoded = jwt.verify(token.value, process.env.SECRET_KEY as string) as { userId: string, role: string };
            if (decoded.role === "admin") {
                return NextResponse.next()
            } else {
                return NextResponse.redirect(new URL("/no-access", request.url));
            }
        } catch (error) {
            if (error instanceof TokenExpiredError) {
                return NextResponse.redirect(new URL("/?expired=true", request.url));
            }
            return NextResponse.redirect(new URL("/no-access", request.url));
        }
    }
    if (token && request.nextUrl.pathname === "/login") {
        return NextResponse.redirect(new URL("/", request.url));
    }
}
 