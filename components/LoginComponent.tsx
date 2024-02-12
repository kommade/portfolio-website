"use client";

import { login } from "@/functions/actions";
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
                } else {
                    router.push("/")
                }
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
                    <label className="text-start text-eggplant-purple xs-semibold">
                        Username:
                    </label>
                    <input className={`w-[300px] h-[42px] bg-neutral-light-grey pl-2 s-regular focus:ring-2 focus:border-none ${response.username ? "border-b-2 border-red-600" : ""}`} spellCheck={false} name="username" autoComplete="off"/>
                    <p className="xs-regular text-red-600">{response.username ? output : ""}</p>
                </section>
                <section className="flex flex-col mt-2 gap-2.5">
                    <label className="text-start text-eggplant-purple xs-semibold">
                        Password:
                    </label>
                    <input className={`w-[300px] h-[42px] bg-neutral-light-grey pl-2 s-regular focus:ring-2 focus:border-none ${response.password ? "border-b-2 border-red-600" : ""}`} name="password" type="password" autoComplete="off"/>
                    <p className="xs-regular text-red-600">{response.password ? output : ""}</p>
                </section>
            </div>
            <input className="m-2 w-[300px] h-[54px] bg-eggplant-purple rounded-xl px-6 py-1 hover:cursor-pointer s-light text-white text-center active:bg-orange-50 active:border border-eggplant-purple active:text-eggplant-purple" type="submit" value="Login" />
        </form>
  )
}

export default LoginComponent