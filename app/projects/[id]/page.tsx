"use client";

import { getProjectKey, isAllowedToAccess, getProjectData } from "@/functions/actions";
import { getToken, logout } from "@/functions/AuthContext";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { FooterComponent, HeaderComponent, LoadingComponent, MessageDisplayComponent, ScrollComponent } from "@/components";

interface ProjectData {
    name: string,
    year: string,
    data: {
        sidebar: {
            "project-type": string[],
            "team": string[],
            "skillset": string[],
            "approach": string[]
        },
        main: {
            "brief": string,
            "problem-definition": string,
            "research-and-ideation": string
        },
        images: string[]
    }
}

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
            console.log(res.data)
            setData(res.data as ProjectData | null);

            setIsLoading(false);
        };
        fetchData();
    }, [params.id]);
    
    if (!access && !isLoading) {
        return (
            <main className="flex flex-col items-center justify-between overflow-x-clip">
                <div className="w-screen relative flex flex-col">
                    <HeaderComponent/>
                    <MessageDisplayComponent text="This project is private. Please login to proceed!"/>
                </div>
            </main>
        )
    }
    if (isLoading) {
        return (
            <main className="flex flex-col items-center justify-between overflow-x-clip">
                <div className="w-screen relative flex flex-col">
                    <HeaderComponent/>
                    <LoadingComponent/>
                </div>
            </main>
        )
    } else if (data === null) {
        return (
            <main className="flex flex-col items-center justify-between overflow-x-clip">
                <div className="w-screen relative flex flex-col">
                    <HeaderComponent/>
                    <MessageDisplayComponent text="Whoops! Something went wrong. "/>
                </div>
            </main>
        );
    }
    return (
        <main className="flex flex-col items-center justify-between overflow-x-clip">
            <div className="w-screen min-h-[100vh] relative flex flex-col">
                <HeaderComponent/>
                <section className="w-[100%] min-h-[calc(100vh_-_108px)] lg:min-h-[calc(100vh_-_138px)] relative justify-between items-start mt-[40px] lg:mt-[70px] lg:mx-auto flex flex-col lg:flex-row">
                    <div className={`flex w-full my-4 lg:mt-0 lg:w-[300px] border-y lg:border-none`}>
                        <article className={`h-fit s-regular flex flex-col justify-start items-start mx-auto py-4 lg:py-[60px] px-20 lg:px-0 `}>
                            <ul className="flex-col justify-start items-start inline-flex">
                                <h2 className="mb-[15px]">{data?.name}</h2>
                                <h5>{data?.year}</h5>
                            </ul>
                            <ul className="flex-col justify-start items-start inline-flex mt-[30px]">
                                <h4 className="text-air-force-blue text-[14px] mb-[5px]">PROJECT TYPE</h4>
                                {data.data.sidebar["project-type"].map((string, index) => <li key={`pt-${index}`}>{string}</li>)}
                            </ul>
                            <ul className="flex-col justify-start items-start inline-flex mt-[35px]">
                                <h4 className="text-air-force-blue text-[14px] mb-[5px]">TEAM</h4>
                                {data.data.sidebar["team"].map((string, index) => <li key={`t-${index}`}>{string}</li>)}
                            </ul>
                            <ul className="flex-col justify-start items-start inline-flex mt-[35px]">
                                <h4 className="text-air-force-blue text-[14px] mb-[5px]">SKILLSET</h4>
                                {data.data.sidebar["skillset"].map((string, index) => <li key={`s-${index}`}>{string}</li>)}
                            </ul>
                            <ul className="flex-col justify-start items-start inline-flex mt-[35px]">
                                <h4 className="text-air-force-blue text-[14px] mb-[5px]">APPROACH</h4>
                                {data.data.sidebar["approach"].map((string, index) => <li key={`a-${index}`}>{string}</li>)}
                            </ul>
                        </article>
                    </div>
    
                    <article className={`mx-auto lg:py-[60px] lg:w-[calc(100vw_-_300px)] w-fit flex flex-col justify-center items-center`}>
                        <div className="w-[90%]">
                            <img className="w-full h-full object-cover" src={data.data.images[0]}/>
                        </div>
                        <section className="w-[90%] flex-col justify-center items-start flex mt-[60px]">
                            <h4>BRIEF</h4>
                            <p className="s-regular my-[10px]">
                                {data.data.main["brief"]}
                            </p>
                        </section>
                        <section className="w-[90%] flex-col justify-center items-start flex mt-[60px]">
                            <h4>PROBLEM DEFINITION</h4>
                            <p className="s-regular my-[10px]">
                                {data.data.main["problem-definition"]}
                            </p>  
                        </section>
                        <div className="w-[90%] mt-[20px]">
                            <img className="w-full object-cover" src={data.data.images[1]}/>
                        </div>
                        <section className="w-[90%] flex-col justify-start items-start flex mt-[60px]">
                            <h4>RESEARCH AND IDEATION</h4>
                            <p className="s-regular my-[10px]">
                                {data.data.main["research-and-ideation"]}
                            </p>
                            <article className="w-full lg:aspect-[11/9] flex flex-col gap-4 lg:gap-6 mt-[20px]">
                                <div className="w-full justify-start items-stretch gap-4 lg:gap-6 inline-flex flex-col lg:flex-row">
                                    <div className="lg:w-[63%] aspect-[17/12]">
                                        <img className="w-full h-full object-cover" src={data.data.images[2]}/>
                                    </div>
                                    <div className="lg:w-[37%] aspect-[14/17]">
                                        <img className="w-full h-full object-cover" src={data.data.images[3]}/>
                                    </div>
                                </div>
                                <div className="w-full justify-start items-stretch gap-4 lg:gap-6 inline-flex flex-col lg:flex-row">
                                    <div className="lg:w-[50%] aspect-[7/5]">
                                        <img className="w-full h-full object-cover" src={data.data.images[4]}/>
                                    </div>
                                    <div className="lg:w-[50%] aspect-[7/5]">
                                        <img className="w-full h-full object-cover" src={data.data.images[5]}/>
                                    </div>
                                </div>
                            </article>
                        </section>
                        <section className="w-[90%] flex-col justify-start items-start flex">
                            <h4 className="my-[60px]">PROTOTYPING, DESIGN AND PITCHING</h4>
                            <article className="w-full lg:aspect-[11/9] flex flex-col gap-4 lg:gap-6">
                                <div className="w-full justify-start items-stretch gap-4 lg:gap-6 inline-flex flex-col lg:flex-row">
                                    <div className="lg:w-[63%] aspect-[17/12]">
                                        <img className="w-full h-full object-cover" src={data.data.images[6]}/>
                                    </div>
                                    <div className="lg:w-[37%] aspect-[14/17]">
                                        <img className="w-full h-full object-cover" src={data.data.images[7]}/>
                                    </div>
                                </div>
                                <div className="w-full justify-start items-stretch gap-4 lg:gap-6 inline-flex flex-col lg:flex-row">
                                    <div className="lg:w-[50%] aspect-[7/5]">
                                        <img className="w-full h-full object-cover" src={data.data.images[8]}/>
                                    </div>
                                    <div className="lg:w-[50%] aspect-[7/5]">
                                        <img className="w-full h-full object-cover" src={data.data.images[9]}/>
                                    </div>
                                </div>
                            </article>
                        </section>
                    </article>
                    
                </section>
                <ScrollComponent/>
                <FooterComponent/>
            </div>
      </main>
    )
}