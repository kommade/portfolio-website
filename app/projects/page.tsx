"use client";

import { FooterComponent, GridComponents, HeaderComponent, LoadingComponent, MessageDisplayComponent, ScrollComponent, ScrollToTop } from "@/components";
import { getToken, logout } from "@/functions/AuthContext";
import { getAllProjects, isAllowedToAccess } from "@/functions/actions";
import { useSearchParams } from "next/navigation";
import router from "next/router";
import { useState, useEffect, Suspense } from "react";


function Projects() {
    const [keys, setKeys] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState(true);
    const [adminAccess, setAdminAccess] = useState(false);
    const searchParams = useSearchParams();
    const editMode = searchParams.get("edit") === "true";
    useEffect(() => {
        const fetchKeys = async () => {
            const res = await getAllProjects();
            setKeys(res);
        }
        const checkAccess = async () => {
            const allowed = await isAllowedToAccess(getToken(), 'admin');
            switch (allowed) {
                case "expired":
                    logout();
                    router.push("/expired=true")
                    return;
                case "yes":
                    setAdminAccess(true);
                    return;
                default:
                    return;
            }
        }
        if (editMode) {
            checkAccess();
        }
        fetchKeys();
        setIsLoading(false);
    }, [editMode])
    if (isLoading) {
        return <LoadingComponent />
    }
    if (editMode && !adminAccess) {
        return (
            <main className="flex flex-col items-center justify-between overflow-x-clip">
                <div className="w-screen relative flex flex-col">
                    <HeaderComponent />
                    <MessageDisplayComponent/>
                </div>
            </main>
        )
    }
    return (
        <main className="flex flex-col items-center justify-between overflow-x-clip">
            <div className="w-screen h-fit min-h-[100vh] relative flex flex-col">
                <ScrollToTop />
                <HeaderComponent/>
                <GridComponents keys={keys} max={0} showTitle={false} editMode={editMode} />
                <ScrollComponent />
                <FooterComponent/>
            </div>
        </main>
    )
}

export default function ProjectsWrapper() {
    return (
        <Suspense fallback={<LoadingComponent/>}>
            <Projects />
        </Suspense>
    )
}