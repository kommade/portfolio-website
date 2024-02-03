"use client";

import { getProjectData, getProjectKey, isAllowedToAccess } from "@/functions/actions";
import { getToken, logout } from "@/functions/AuthContext";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { FooterComponent, HeaderComponent, LoadingComponent, MessageDisplayComponent, ProjectData, ScrollComponent } from "@/components";
export default function ProjectPage({
    params,
}: {
    params: { id: string };
    }) {
    const router = useRouter();
    const [data, setData] = useState<ProjectData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [access, setAccess] = useState(false);
    useEffect(() => {
        const fetchData = async () => {
            const token = getToken();
            const allowed = await isAllowedToAccess(token, params.id)
            switch (allowed) {
                case "expired":
                    logout();
                    router.push("/expired=true");
                    setIsLoading(false);
                    return;
                case "yes":
                    setAccess(true);
                    break;
                default:
                    setIsLoading(false);
                    return;
            }
            let res = await getProjectKey(params.id);
            if (!res.success) {
                return;
            }
            const projectKey = res.data as string;
            if (!projectKey) {
                return;
            }
            res = await getProjectData(projectKey);
            if (!res.success) {
                return;
            }
            setData(res.data as ProjectData | null);

            setIsLoading(false);
        };
        fetchData();
    }, [params.id]);
    if (data === null && !isLoading && access) {
        return (
            <main className="flex flex-col items-center justify-between overflow-x-clip">
                <div className="w-screen relative flex flex-col">
                    <HeaderComponent/>
                    <MessageDisplayComponent text="Whoops! Something went wrong. "/>
                </div>
            </main>
        );
    } else if (isLoading) {
        return (
            <main className="flex flex-col items-center justify-between overflow-x-clip">
                <div className="w-screen relative flex flex-col">
                    <HeaderComponent/>
                    <LoadingComponent/>
                </div>
            </main>
        )
    }
    return (
        <main className="flex flex-col items-center justify-between overflow-x-clip">
            <div className="w-screen min-h-[100vh] relative flex flex-col">
                <HeaderComponent/>
                {
                    access ? (
                        <section className="w-[100%] min-h-[calc(100vh_-_108px)] lg:min-h-[calc(100vh_-_138px)] relative justify-between items-start mt-[40px] lg:mt-[70px] lg:mx-auto flex flex-col lg:flex-row">
                            <div className={`flex w-full my-4 lg:mt-0 lg:w-[300px] border-y lg:border-none`}>
                                <article className={`h-fit s-regular flex flex-col justify-start items-start mx-auto py-4 lg:py-[60px] px-20 lg:px-0 `}>
                                    <ul className="flex-col justify-start items-start inline-flex">
                                        <h2 className="mb-[15px]">Love Our Hood Fund</h2>
                                        <h5>2023</h5>
                                    </ul>
                                    <ul className="flex-col justify-start items-start inline-flex mt-[30px]">
                                        <h4 className="text-air-force-blue text-[14px] mb-[5px]">PROJECT TYPE</h4>
                                        <li>Industrial/Product Design</li>
                                        <li>Community grant</li>
                                    </ul>
                                    <ul className="flex-col justify-start items-start inline-flex mt-[35px]">
                                        <h4 className="text-air-force-blue text-[14px] mb-[5px]">TEAM</h4>
                                        <li className="">4 team members including myself</li>
                                    </ul>
                                    <ul className="flex-col justify-start items-start inline-flex mt-[35px]">
                                        <h4 className="text-air-force-blue text-[14px] mb-[5px]">SKILLSET</h4>
                                        <li>Graphic Design</li>
                                        <li>3D design and visualisation</li>
                                        <li>Physical prototyping</li>
                                    </ul>
                                    <ul className="flex-col justify-start items-start inline-flex mt-[35px]">
                                        <h4 className="text-air-force-blue text-[14px] mb-[5px]">APPROACH</h4>
                                        <li>Problem definition</li>
                                        <li>Research and Ideation</li>
                                        <li>Prototyping and design</li>
                                        <li>Project pitch</li>
                                        <li>Iteration</li>
                                        <li>Manufacture and assembly</li>
                                    </ul>
                                </article>
                            </div>
            
                            <article className={`mx-auto lg:py-[60px] lg:w-[calc(100vw_-_300px)] w-fit flex flex-col justify-center items-center`}>
                                <div className="w-[90%] aspect-[8/5] bg-zinc-300" />
                                <section className="w-[90%] flex-col justify-center items-start flex mt-[60px]">
                                    <h4>BRIEF</h4>
                                    <p className="s-regular my-[10px]">
                                        This was a design challenge done as part of a youth challenge launched by the Municipal Services Office (MSO) Singapore. MSO mentors and funds youths up to $10,000 to pilot municipal-related ideas within their community. We chose to tackle the problem of neighbourhood noise in HDB blocks in Singapore.
                                    </p>
                                </section>
                                <section className="w-[90%] flex-col justify-center items-start flex mt-[60px]">
                                    <h4>PROBLEM DEFINITION</h4>
                                    <p className="s-regular my-[10px]">
                                        Statistics show that noise-related feedback to the town council and police force increased sharply during the COVID-19 pandemic and remained at elevated levels. 42% of all the feedback received was regarding noise from DIY renovation.
                                    </p>  
                                </section>
                                <div className="w-[90%] aspect-[8/5] bg-zinc-300 mt-[20px]" />
                                <section className="w-[90%] flex-col justify-start items-start flex mt-[60px]">
                                    <h4>RESEARCH AND IDEATION</h4>
                                    <p className="s-regular my-[10px]">
                                        Our interviews revealed that neighbours want a non-confrontational, fuss-free way to address noise-related issues. Through ideation sessions, the idea of having a notification message board that promoted communication and interaction arose, inspired by the way locksmiths arrange keys.
                                    </p>
                                    <article className="w-full lg:aspect-[11/9] flex flex-col gap-4 lg:gap-6 mt-[20px]">
                                        <div className="w-full justify-start items-stretch gap-4 lg:gap-6 inline-flex flex-col lg:flex-row">
                                            <div className="lg:w-[63%] aspect-[17/12] bg-zinc-300" />
                                            <div className="lg:w-[37%] aspect-[14/17] bg-zinc-300" />
                                        </div>
                                        <div className="w-full justify-start items-stretch gap-4 lg:gap-6 inline-flex flex-col lg:flex-row">
                                            <div className="lg:w-[50%] aspect-[7/5] bg-zinc-300" />
                                            <div className="lg:w-[50%] aspect-[7/5] bg-zinc-300" />
                                        </div>
                                    </article>
                                </section>
                                <section className="w-[90%] flex-col justify-start items-start flex">
                                    <h4 className="my-[60px]">PROTOTYPING, DESIGN AND PITCHING</h4>
                                    <article className="w-full lg:aspect-[11/9] flex flex-col gap-4 lg:gap-6">
                                        <div className="w-full justify-start items-stretch gap-4 lg:gap-6 inline-flex flex-col lg:flex-row">
                                            <div className="lg:w-[63%] aspect-[17/12] bg-zinc-300" />
                                            <div className="lg:w-[37%] aspect-[14/17] bg-zinc-300" />
                                        </div>
                                        <div className="w-full justify-start items-stretch gap-4 lg:gap-6 inline-flex flex-col lg:flex-row">
                                            <div className="lg:w-[50%] aspect-[7/5] bg-zinc-300" />
                                            <div className="lg:w-[50%] aspect-[7/5] bg-zinc-300" />
                                        </div>
                                    </article>
                                </section>
                            </article>
                            
                        </section>
                    ) : <MessageDisplayComponent text="This project is private. Please login to proceed!"/>
                }
                <ScrollComponent/>
                <FooterComponent/>
            </div>
      </main>
    )
}