"use client";

import { getProjectData, getProjectKey, isAllowedToAccess } from "@/actions/actions";
import { getToken, logout } from "@/components/AuthContext";
import FooterComponent from "@/components/FooterComponent";
import { ProjectData } from "@/components/GridComponents";
import HeaderComponent from "@/components/HeaderComponent";
import LoadingComponent from "@/components/LoadingComponent";
import NoAccessComponent from "@/components/NoAccessComponent";
import ScrollComponent from "@/components/ScrollComponent";
import SomethingWentWrongComponent from "@/components/SomethingWentWrongComponent";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
export default function ProjectPage({
    params,
}: {
    params: { id: string };
    }) {
    const router = useRouter();
    const [data, setData] = useState<ProjectData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [access, setAccess] = useState(false);
    const [sidebarIsOpen, setSidebarIsOpen] = useState(true);
    const [isHovered, setisHovered] = useState(false);
    useEffect(() => {
        const fetchData = async () => {
            const token = getToken();
            const allowed = await isAllowedToAccess(token, params.id)
            switch (allowed) {
                case "expired":
                    logout();
                    router.push("/");
                    setIsLoading(false);
                    return;
                case "yes":
                    setAccess(true);
                    break;
                default:
                    setIsLoading(false);
                    return;
            }
            const res = await getProjectKey(params.id);
            if (!res.success) {
                return;
            }
            const projectKey = res.data as string;
            if (!projectKey) {
                return;
            }
            let stored;
            if (typeof localStorage !== 'undefined') {
                stored = localStorage.getItem(projectKey);
            }
            if (!stored) {
                const res = await getProjectData(projectKey);
                if (!res.success) {
                    return;
                }
                if (typeof localStorage !== 'undefined') {
                    localStorage.setItem('myData', JSON.stringify(data));
                }
                setData(res.data as ProjectData | null);
            } else {
                const data = JSON.parse(stored)
                setData(data);
            }
            setIsLoading(false);
        };
        fetchData();
    }, [params.id]);
    if (data === null && !isLoading && access) {
        return (
            <main className="flex flex-col items-center justify-between overflow-x-clip">
                <div className="w-screen relative flex flex-col">
                    <HeaderComponent/>
                    <SomethingWentWrongComponent/>
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
            <div className="w-screen h-[100vh] relative flex flex-col">
                <HeaderComponent/>
                {
                    access ? (
                        <section className="w-[100%] h-fit min-h-[calc(100%_-_128px)] relative justify-between items-start pt-[60px] lg:mx-auto flex flex-col lg:flex-row">
                            <div className={`lg:fixed flex w-full h-full ease-in-out z-0 transition-[colors,_width] mt-4 lg:mt-0 ${sidebarIsOpen ? 'lg:w-[30vw]' : 'lg:w-[5vw] '}`}>
                                <section
                                    className={`overflow-x-hidden flex w-full ${sidebarIsOpen ? 'lg:w-[25vw]' : 'lg:w-0 '}`}
                                    onMouseEnter={() => setisHovered(true)}
                                    onMouseLeave={() => setisHovered(false)}
                                >
                                    <article className="lg:w-[25vw] flex flex-col flex-shrink-0 justify-start items-start mx-auto lg:ml-8 py-4 lg:py-0 px-20 lg:p-4 border rounded-lg lg:border-none lg:rounded-none">
                                        <ul className="h-fit flex-col justify-start items-start inline-flex mb-4 mt-4">
                                            <li className="text-black text-[26px] font-[600] font-['Junicode']">Love Our Hood Fund</li>
                                            <li className="text-black text-sm font-normal font-['Epilogue'] tracking-tight">2023</li>
                                        </ul>
                                        <ul className="h-fit flex-col justify-start items-start inline-flex my-2">
                                            <li className="project-list-title text-blue-500">PROJECT TYPE</li>
                                            <li className="project-list-subtitle">Industrial/Product Design</li>
                                            <li className="project-list-subtitle">Community grant</li>
                                        </ul>
                                        <ul className="h-fit flex-col justify-start items-start inline-flex my-2">
                                            <li className="project-list-title text-blue-500">TEAM</li>
                                            <li className="project-list-subtitle">4 team members including myself</li>
                                        </ul>
                                        <ul className="h-fit flex-col justify-start items-start inline-flex my-2">
                                            <li className="project-list-title text-blue-500">SKILLSET</li>
                                            <li className="project-list-subtitle">Graphic Design</li>
                                            <li className="project-list-subtitle">3D design and visualisation</li>
                                            <li className="project-list-subtitle">Physical prototyping</li>
                                        </ul>
                                        <ul className="h-fit flex-col justify-start items-start inline-flex my-2">
                                            <li className="project-list-title text-blue-500">APPROACH</li>
                                            <li className="project-list-subtitle">Problem definition</li>
                                            <li className="project-list-subtitle">Research and Ideation</li>
                                            <li className="project-list-subtitle">Prototyping and design</li>
                                            <li className="project-list-subtitle">Project pitch</li>
                                            <li className="project-list-subtitle">Iteration</li>
                                            <li className="project-list-subtitle">Manufacture and assembly</li>
                                        </ul>
                                    </article>
                                </section>
                                
                                <div
                                    className={`w-[5vw] self-stretch z-1 justify-center items-start hidden lg:flex transition-colors ease-in-out ${sidebarIsOpen ? "ml-0 transition-[margin-left]" : "ml-2"}`}
                                    onMouseEnter={() => setisHovered(true)}
                                    onMouseLeave={() => setisHovered(false)}
                                >
                                    <button className={`w-8 h-8 hover:bg-white mt-4 rounded-lg mx-2 ${isHovered ? "opacity-100" : sidebarIsOpen ? "opacity-0" : "opacity-100"} transition-opacity ease-in-out`} onClick={() => setSidebarIsOpen(!sidebarIsOpen)}>
                                        <svg className="mx-auto" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 50 50">
                                            {!sidebarIsOpen ? (
                                                <path id="menu" d="M 0 9 L 0 11 L 50 11 L 50 9 Z M 0 24 L 0 26 L 50 26 L 50 24 Z M 0 39 L 0 41 L 50 41 L 50 39 Z"/>
                                            ) : (
                                                <path id="close" d="M 7.71875 6.28125 L 6.28125 7.71875 L 23.5625 25 L 6.28125 42.28125 L 7.71875 43.71875 L 25 26.4375 L 42.28125 43.71875 L 43.71875 42.28125 L 26.4375 25 L 43.71875 7.71875 L 42.28125 6.28125 L 25 23.5625 Z"/>
                                            )}
                                        </svg>
                                    </button>
                                </div>
                            </div>
                
                            <article className={`transition-[width] ease-in-out ml-auto mr-6 ${sidebarIsOpen ? "lg:w-[70vw]" : "lg:w-[95vw]"} w-fit flex flex-col justify-center items-center`}>
                                <section className="w-[90%] flex-col justify-center items-start flex mb-4 mt-2">
                                    <div className="w-full aspect-[8/5] bg-zinc-300 my-4" />
                                    <h1 className="project-list-title text-gray-700">BRIEF</h1>
                                    <p className="project-list-subtitle">
                                        This was a design challenge done as part of a youth challenge launched by the Municipal Services Office (MSO) Singapore. MSO mentors and funds youths up to $10,000 to pilot municipal-related ideas within their community. We chose to tackle the problem of neighbourhood noise in HDB blocks in Singapore.
                                    </p>
                                </section>
                                <section className="w-[90%] flex-col justify-center items-start flex my-4">
                                    <h1 className="project-list-title text-gray-700">PROBLEM DEFINITION</h1>
                                    <p className="project-list-subtitle">
                                        Statistics show that noise-related feedback to the town council and police force increased sharply during the COVID-19 pandemic and remained at elevated levels. 42% of all the feedback received was regarding noise from DIY renovation.
                                    </p>
                                    <div className="w-full aspect-[8/5] bg-zinc-300 my-4" />
                                </section>
                                <section className="w-[90%] flex-col justify-start items-start flex gap-6 my-4">
                                    <h1 className="project-list-title text-gray-700">RESEARCH AND IDEATION</h1>
                                    <p className="project-list-subtitle">
                                        Our interviews revealed that neighbours want a non-confrontational, fuss-free way to address noise-related issues. Through ideation sessions, the idea of having a notification message board that promoted communication and interaction arose, inspired by the way locksmiths arrange keys.
                                    </p>
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
                                <section className="w-[90%] flex-col justify-start items-start flex gap-4 lg:gap-6 my-4">
                                    <h1 className="project-list-title text-gray-700">PROTOTYPING, DESIGN AND PITCHING</h1>
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
                    ) : <NoAccessComponent text="This project is private. Please login to proceed!"/>
                }
                <ScrollComponent/>
                {sidebarIsOpen ? <></> : <FooterComponent/>}
            </div>
      </main>
    )
}