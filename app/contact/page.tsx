"use client";

import { submitContactForm } from "@/actions/actions";
import FooterComponent from "@/components/FooterComponent";
import HeaderComponent from "@/components/HeaderComponent"
import { useRouter } from "next/navigation";
import React, { useState } from 'react'

const Contact = () => {
    const router = useRouter()
    const [output, setOutput] = useState("");
    return (
        <main className="flex flex-col items-center justify-between overflow-x-clip">
            <div className="w-screen relative flex flex-col">
                <HeaderComponent/>
                <form
                    className="w-full h-[68vh] relative items-center justify-center mt-28 flex flex-col"
                    action={async (formData) => {
                        const res = await submitContactForm(formData);
                        if (res.success) {
                            router.push("/")
                            // show a popup
                        } else {
                            switch (res.message) {
                                case "invalid email":
                                    setOutput("Invalid email")
                                    break;
                                default:
                                    setOutput("Something went wrong")
                                    break;
                            }
                        }
                    }}
                >
                    <div className="flex flex-col">
                        <h1 className="m-2 text-red-600 font-['Epilogue'] text-xs">{output}</h1>
                        <section className="flex flex-col m-2 gap-2.5">
                            <label className="text-start text-gray-700 text-sm font-semibold font-['Epilogue'] leading-[17.40px] tracking-tight">
                                Name:
                            </label>
                            <input className="w-[300px] h-[35px] bg-neutral-200 pl-2 font-['Epilogue'] text-sm" spellCheck={false} name="name" required/>
                        </section>
                        <section className="flex flex-col m-2 gap-2.5">
                            <label className="text-start text-gray-700 text-sm font-semibold font-['Epilogue'] leading-[17.40px] tracking-tight" >
                                Email:
                            </label>
                            <input className="w-[300px] h-[35px] bg-neutral-200 pl-2 font-['Epilogue'] text-sm focus:ring-2" spellCheck={false} name="email" type="email" required/>
                        </section>
                        <section className="flex flex-col m-2 gap-2.5">
                            <label className="text-start text-gray-700 text-sm font-semibold font-['Epilogue'] leading-[17.40px] tracking-tight" >
                                Message:
                            </label>
                            <textarea className="w-[300px] h-[100px] bg-neutral-200 p-2 font-['Epilogue'] text-sm focus:ring-2" name="message" required/>
                        </section>
                    </div>
                    <input className="m-3 w-[300px] h-[54px] bg-gray-700 rounded-xl px-6 py-1 hover:cursor-pointer text-center text-white text-base font-light font-['Epilogue'] leading-normal tracking-tight active:bg-orange-50 active:border border-gray-700 active:text-gray-700" type="submit" value="Submit" />
                </form>
                <FooterComponent/>
            </div>
        </main>
    )
}

export default Contact