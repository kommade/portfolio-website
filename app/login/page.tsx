"use client";

import { FooterComponent, HeaderComponent, LoadingComponent, LoginComponent } from "@/components";
import isLoggedIn from "@/functions/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Login() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirect = searchParams.get("redirect")
    const [isLoading, setIsLoading] = useState(true)
    useEffect(() => {
        if (isLoggedIn()) {
            router.push("/");
        } else {
            setIsLoading(false);
        }
    }, []);
    
    return (
        !isLoading ? (
            <main className="flex flex-col items-center justify-between overflow-x-clip">
                <div className="w-screen h-[100vh] relative flex flex-col">
                    <HeaderComponent isLoginPage={true} />
                    <LoginComponent redirect={redirect ? redirect : "/"} />
                    <FooterComponent/>
                </div>
            </main>
        ) : <LoadingComponent/>
    );
}
