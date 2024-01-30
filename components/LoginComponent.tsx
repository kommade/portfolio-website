"use client";

import { login } from "@/actions/actions";
import { useRouter } from "next/navigation"
import React, { useState } from 'react'

const LoginComponent = ( { redirect } : { redirect : string | undefined } ) => {
    const router = useRouter();
    const [output, setOutput] = useState("");
    const [response, setResponse] = useState<{ username: boolean, password: boolean }>({ username: false, password: false })
    return (
        <form action={async formData => {
            const out = await login(formData);
            if (out.success) {
                if (typeof localStorage !== 'undefined') {
                    localStorage.setItem("token", out.message)
                }
                if (redirect) {
                    router.push(redirect);
                }
                router.push("/")
                return;
            } else {
                if (out.message === "Incorrect password") {
                    setResponse({ username: false, password: true })
                } else if (out.message = "Please fill in the required blanks") {
                    setResponse({ username: true, password: true })
                } else {
                    setResponse({ username: true, password: false })
                }
                
            }
            setOutput(out.message);
        }} className="w-full min-h-[calc(100vh_-_108px)] lg:min-h-[calc(100vh_-_138px)] relative justify-center items-center mt-[40px] lg:mt-[70px] inline-flex flex-col">
            <div className="flex flex-col m-4 ">
                <section className="flex flex-col gap-2.5">
                    <label className="text-start text-gray-700 xs-semibold">
                        Username:
                    </label>
                    <input className={`w-[300px] h-[42px] bg-neutral-200 pl-2 font-['Epilogue'] text-sm focus:ring-2 focus:border-none ${response.username ? "border-b-2 border-red-600" : ""}`} spellCheck={false} name="username" />
                    <p className="xs-regular text-red-600">{response.username ? output : ""}</p>
                </section>
                <section className="flex flex-col mt-2 gap-2.5">
                    <label className="text-start text-gray-700 xs-semibold">
                        Password:
                    </label>
                    <input className={`w-[300px] h-[42px] bg-neutral-200 pl-2 font-['Epilogue'] text-sm focus:ring-2 focus:border-none ${response.password ? "border-b-2 border-red-600" : ""}`} name="password" type="password" />
                    <p className="xs-regular text-red-600">{response.password ? output : ""}</p>
                </section>
            </div>
            <input className="m-2 w-[300px] h-[54px] bg-gray-700 rounded-xl px-6 py-1 hover:cursor-pointer s-light text-center text-white text-base font-light active:bg-orange-50 active:border border-gray-700 active:text-gray-700" type="submit" value="Login" />
        </form>
  )
}

export default LoginComponent