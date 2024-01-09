"use client";

import HeaderComponent from "@/components/HeaderComponent";
import LoginComponent from "@/components/LoginComponent";
import isLoggedIn from "@/components/AuthContext";
import { useRouter } from "next/navigation";

export default function Login() {
    const router = useRouter();
    if (isLoggedIn()) {
        router.push("/");
        return;
        // show a pop up or something
    }
    return (
        <main className="flex flex-col items-center justify-between overflow-x-clip">
            <div className="w-screen relative flex flex-col">
                <HeaderComponent isLoginPage={true} />
                <LoginComponent/>
            </div>
        </main>
    );
}
