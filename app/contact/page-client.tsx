"use client";

import { HeaderComponent, FooterComponent, usePopUp, PopUpComponent } from "@/components";
import { submitContactForm } from "@/functions/actions";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from 'react'

const Contact = () => {
    const router = useRouter()
    const [popUp, setPopUp] = usePopUp();
    return (
        <main className="flex flex-col items-center justify-between overflow-x-clip">
            <div className="w-screen h-[100vh] relative flex flex-col">
                <HeaderComponent/>
                <section className="w-full min-h-[calc(100%_-_128px)] lg:min-h-[calc(100vh_-_138px)] relative flex justify-center items-center mt-[40px] lg:mt-[70px]">
                    <Image
                        className="absolute -translate-x-[300px]"
                        src="/images/contact-page-cat.png"
                        alt="contact"
                        width={250}
                        height={333}
                        priority
                        draggable={false}
                        onContextMenu={(e) => e.preventDefault()}
                    />
                    <form
                        className="relative items-center justify-center flex flex-col"
                        action={async (formData) => {
                            const res = await submitContactForm(formData);
                            if (res.success) {
                                setPopUp({
                                    message: "Message sent!",
                                    type: "success",
                                    duration: 1000
                                });
                                setTimeout(() => {
                                    router.push("/");
                                }, 1000);
                            } else {
                                switch (res.message) {
                                    case "invalid email":
                                        setPopUp({
                                            message: "Invalid email",
                                            type: "warning",
                                            duration: 1000
                                        })
                                        break;
                                    default:
                                        setPopUp({
                                            message: "Something went wrong",
                                            type: "warning",
                                            duration: 1000
                                        })
                                        break;
                                }
                            }
                        }}
                    >
                        <div className="flex flex-col">
                            <section className="flex flex-col m-2 gap-2.5">
                                <label className="xs-semibold text-start text-eggplant-purple">
                                    Name:
                                </label>
                                <input className="w-[300px] h-[35px] bg-neutral-200 pl-2 s-regular" spellCheck={false} name="name" required autoComplete="name"/>
                            </section>
                            <section className="flex flex-col m-2 gap-2.5">
                                <label className="xs-semibold text-start text-eggplant-purple" >
                                    Email:
                                </label>
                                <input className="w-[300px] h-[35px] bg-neutral-200 pl-2 s-regular focus:ring-2" spellCheck={false} name="email" type="email" required/>
                            </section>
                            <section className="flex flex-col m-2 gap-2.5">
                                <label className="xs-semibold text-start text-eggplant-purple" >
                                    Message:
                                </label>
                                <textarea className="w-[300px] h-[150px] bg-neutral-200 p-2 s-regular focus:ring-2 resize-none" name="message" required/>
                            </section>
                        </div>
                        <input className="m-3 w-[300px] h-[54px] bg-eggplant-purple rounded-xl px-6 py-1 hover:cursor-pointer text-center s-light active:bg-orange-50 active:border active:border-eggplant-purple text-white active:text-eggplant-purple" type="submit" value="Submit" />
                    </form>
                </section>
                <PopUpComponent popUpProps={popUp}/>
                <FooterComponent/>
            </div>
        </main>
    )
}

export default Contact