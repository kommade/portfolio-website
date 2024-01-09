"use client";

import HeaderComponent from "@/components/HeaderComponent";
import LoginComponent from "@/components/LoginComponent";
import isLoggedIn from "@/components/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import FooterComponent from "@/components/FooterComponent";

export default function Login() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirect = searchParams.get("redirect")
    useEffect(() => {
        if (isLoggedIn()) {
            router.push("/");
        }
    }, []);
    // fix so it doesnt show before confirming
    return (
        <main className="flex flex-col items-center justify-between overflow-x-clip">
            <div className="w-screen relative flex flex-col">
                <HeaderComponent isLoginPage={true} />
                <LoginComponent redirect={redirect ? redirect : "/"} />
                <FooterComponent/>
            </div>
        </main>
    );
}
