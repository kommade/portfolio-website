"use client";

import { FooterComponent, HeaderComponent, LoginComponent } from "@/components";
import { useSearchParams } from "next/navigation";

export function Login() {
    const searchParams = useSearchParams();
    const redirect = searchParams.get("redirect")

    return (
        <main className="flex flex-col items-center justify-between overflow-x-clip">
            <div className="w-screen h-[100vh] relative flex flex-col">
                <HeaderComponent isLoginPage={true} />
                <LoginComponent redirect={redirect ? redirect : "/"} />
                <FooterComponent/>
            </div>
        </main>
    );
}