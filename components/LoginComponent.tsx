"use client";

import { login } from "@/actions/actions";
import { useRouter } from "next/navigation"
import React, { useState } from 'react'

const LoginComponent = ( { redirect } : { redirect : string | undefined } ) => {
    const router = useRouter();
    const [output, setOutput] = useState("");
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
                return;
            }
            setOutput(out.message);
        }} className="w-full h-[70vh] relative justify-center items-center mt-28 inline-flex flex-col">
            <div className="flex flex-col m-4 ">
                <h1 className="m-2 text-red-600 font-['Epilogue'] text-xs">{output}</h1>
                <section className="flex flex-col m-2 gap-2.5">
                    <label className="text-start text-gray-700 text-sm font-semibold font-['Epilogue'] leading-[17.40px] tracking-tight">
                        Username:
                    </label>
                    <input className="w-[300px] h-[42px] bg-neutral-200 pl-2 font-['Epilogue'] text-sm" spellCheck={false} name="username" />
                </section>
                <section className="flex flex-col m-2 gap-2.5">
                    <label className="text-start text-gray-700 text-sm font-semibold font-['Epilogue'] leading-[17.40px] tracking-tight">
                        Password:
                    </label>
                    <input className="w-[300px] h-[42px] bg-neutral-200 pl-2 font-['Epilogue'] text-sm focus:ring-2" name="password" type="password" />
                </section>
            </div>
            <input className="m-3 w-[300px] h-[54px] bg-gray-700 rounded-xl px-6 py-1 hover:cursor-pointer text-center text-white text-base font-light font-['Epilogue'] leading-normal tracking-tight active:bg-orange-50 active:border border-gray-700 active:text-gray-700" type="submit" value="Login" />
        </form>
  )
}

export default LoginComponent