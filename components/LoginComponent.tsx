"use client";

import { login } from "@/actions/actions";
import { useRouter } from "next/navigation"
import React, { useState } from 'react'

const LoginComponent = () => {
    const router = useRouter();
    const [output, setOutput] = useState("");
    return (
        <form action={async formData => {
            const out = await login(formData);
            if (out.success) {
                if (typeof localStorage !== 'undefined') {
                    localStorage.setItem("token", out.message)
                }
                router.push("/");
                return;
            }
            setOutput(out.message);
        }} className="w-full h-fit relative items-center justify-center mt-28 flex flex-col">
            <div className="flex flex-row m-2">
                <section className="flex flex-col m-2">
                    <label className="h-6 m-[6px]">
                        Username:
                    </label>
                    <label className="h-6 m-[6px]">
                        Password:
                    </label>
                </section>
                <section className="flex flex-col m-2">
                    <input className="m-1 bg-slate-400 border-2 border-neutral-600" name="username" />
                    <input className="m-1 bg-slate-400 border-2 border-neutral-600" name="password" type="password" />
                </section>
            </div>
            <input className="bg-slate-400 rounded-xl px-6 py-1 font-['Epilogue'] hover:cursor-pointer" type="submit" value="Login" />
            <h1 className="text-red-600">{output}</h1>
        </form>
  )
}

export default LoginComponent