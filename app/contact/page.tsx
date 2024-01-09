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
                    <div className="flex flex-row m-2">
                        <section className="flex flex-col m-2">
                            <label className="h-6 m-[6px]">
                                Name:
                            </label>
                            <label className="h-6 m-[6px]">
                                Email:
                            </label>
                            <label className="h-6 m-[6px]">
                                Message:
                            </label>
                        </section>
                        <section className="flex flex-col m-2">
                            <input className="m-1 bg-slate-400 border-2 border-neutral-600" name="name" placeholder="Your Name..." required/>
                            <input className="m-1 bg-slate-400 border-2 border-neutral-600" name="email" placeholder="Your Email..." required/>
                            <textarea className="m-1 bg-slate-400 border-2 border-neutral-600" name="message" placeholder="Your Message..." required/>
                        </section>
                    </div>
                    <input className="bg-slate-400 rounded-xl px-6 py-1 font-['Epilogue'] hover:cursor-pointer" type="submit" value="Submit" />
                    <h1 className="text-red-600">{output}</h1>
                </form>
                <FooterComponent/>
            </div>
        </main>
    )
}

export default Contact