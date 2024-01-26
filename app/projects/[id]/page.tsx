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
            <div className="w-screen relative flex flex-col">
                <HeaderComponent/>
                {
                    access ? (
                        <section className="w-[100%] h-fit min-h-[70vh] relative justify-center items-center lg:items-start mt-28 lg:ml-14 flex flex-col lg:flex-row">
                            <article className="sidebar lg:w-[20%] w-fit flex flex-col justify-start items-start mr-4">
                                <ul className="h-fit flex-col justify-start items-start inline-flex my-4">
                                    <li className="text-black text-[26px] font-[600] font-['Junicode']">Love Our Hood Fund</li>
                                    <li className="text-black text-sm font-normal font-['Epilogue'] tracking-tight">2023</li>
                                </ul>
                                <ul className="h-fit flex-col justify-start items-start inline-flex my-4">
                                    <li className="project-list-title text-blue-500">PROJECT TYPE</li>
                                    <li className="project-list-subtitle">Industrial/Product Design</li>
                                    <li className="project-list-subtitle">Community grant</li>
                                </ul>
                                <ul className="h-fit flex-col justify-start items-start inline-flex my-4">
                                    <li className="project-list-title text-blue-500">TEAM</li>
                                    <li className="project-list-subtitle">4 team members including myself</li>
                                </ul>
                                <ul className="h-fit flex-col justify-start items-start inline-flex my-4">
                                    <li className="project-list-title text-blue-500">SKILLSET</li>
                                    <li className="project-list-subtitle">Industrial/Product Design, Community grant</li>
                                </ul>
                                <ul className="h-fit flex-col justify-start items-start inline-flex my-4">
                                    <li className="project-list-title text-blue-500">APPROACH</li>
                                    <li className="project-list-subtitle">Problem definition</li>
                                    <li className="project-list-subtitle">Research and Ideation</li>
                                    <li className="project-list-subtitle">Prototyping and design</li>
                                    <li className="project-list-subtitle">Project pitch</li>
                                    <li className="project-list-subtitle">Iteration</li>
                                    <li className="project-list-subtitle">Manufacture and assembly</li>
                                </ul>
                            </article>
                            <article className="project-main lg:w-[70%] w-fit mx-4 flex flex-col justify-center items-center">
                                <section className="w-[90%] flex-col justify-center items-start flex my-4">
                                    <div className="w-full h-[534px] bg-zinc-300 my-4" />
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
                                    <div className="w-full h-[534px] bg-zinc-300 my-4" />
                                </section>
                                <section className="w-[90%] flex-col justify-start items-start flex gap-6 my-4">
                                    <h1 className="project-list-title text-gray-700">RESEARCH AND IDEATION</h1>
                                    <p className="project-list-subtitle">
                                        Our interviews revealed that neighbours want a non-confrontational, fuss-free way to address noise-related issues. Through ideation sessions, the idea of having a notification message board that promoted communication and interaction arose, inspired by the way locksmiths arrange keys.
                                    </p>
                                    <div className="w-full justify-start items-start gap-6 inline-flex">
                                        <div className="w-[63%] h-[372px] bg-zinc-300" />
                                        <div className="w-[37%] h-[372px] bg-zinc-300" />
                                    </div>
                                    <div className="w-full justify-start items-start gap-6 inline-flex">
                                        <div className="w-[50%] h-[302px] bg-zinc-300" />
                                        <div className="w-[50%] h-[302px] bg-zinc-300" />
                                    </div>
                                </section>
                                <section className="w-[90%] flex-col justify-start items-start flex gap-6 my-4">
                                    <h1 className="project-list-title text-gray-700">PROTOTYPING, DESIGN AND PITCHING</h1>
                                    <div className="w-full justify-start items-start gap-6 inline-flex">
                                        <div className="w-[63%] h-[372px] bg-zinc-300" />
                                        <div className="w-[37%] h-[372px] bg-zinc-300" />
                                    </div>
                                    <div className="w-full justify-start items-start gap-6 inline-flex">
                                        <div className="w-[50%] h-[302px] bg-zinc-300" />
                                        <div className="w-[50%] h-[302px] bg-zinc-300" />
                                    </div>
                                </section>
                            </article>
                        </section>
                    ) : <NoAccessComponent text="This project is private. Please login to proceed!"/>
                }
                <ScrollComponent/>
                <FooterComponent/>
            </div>
      </main>
    )
}