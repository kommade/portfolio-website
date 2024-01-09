"use client";

import { getProjectData, getProjectKey, isAllowedToAccess } from "@/actions/actions";
import { getToken, logout } from "@/components/AuthContext";
import FooterComponent from "@/components/FooterComponent";
import { ProjectData } from "@/components/GridComponents";
import HeaderComponent from "@/components/HeaderComponent";
import LoadingComponent from "@/components/LoadingComponent";
import NoAccessComponent from "@/components/NoAccessComponent";
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
                    access ? (<div className="w-[85%] h-[68vh] left-[7.5%] relative justify-center mt-28 flex flex-col">
                            <h1>
                                {data?.name as string}     
                            </h1>
                            <h1>
                                {data?.desc as string}     
                            </h1>
                            <h1>
                                {data?.year as string}
                            </h1>
                        </div>) : <NoAccessComponent text="This project is private. Please login to proceed!"/>
                }
                <FooterComponent/>
            </div>
      </main>
    )
}