"use client";

import { getProjectData, getProjectKey } from "@/actions/actions";
import { getToken } from "@/components/AuthContext";
import { ProjectData } from "@/components/GridComponents";
import HeaderComponent from "@/components/HeaderComponent";
import LoadingComponent from "@/components/LoadingComponent";
import SomethingWentWrongComponent from "@/components/SomethingWentWrongComponent";
import { useState, useEffect } from "react";
export default function ProjectPage({
    params,
}: {
    params: { id: string };
    }) {
    const [data, setData] = useState<ProjectData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const fetchData = async () => {
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
    if (data === null && !isLoading) {
        return (
            <SomethingWentWrongComponent/>
        );
    } else if (isLoading) {
        return (
            <LoadingComponent/>
        )
    }
    return (
        <main className="flex flex-col items-center justify-between overflow-x-clip">
            <div className="w-screen relative flex flex-col">
                <HeaderComponent/>

                <div className="w-[85%] h-fit left-[7.5%] relative justify-center mt-28 flex flex-col">
                    <h1>
                        {data?.name as string}     
                    </h1>
                    <h1>
                        {data?.desc as string}     
                    </h1>
                    <h1>
                        {data?.year as string}
                    </h1>
                </div>
            
            </div>
      </main>
    )
}