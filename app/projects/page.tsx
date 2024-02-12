"use client";

import { FooterComponent, GridComponents, HeaderComponent, PopUpComponent, ScrollComponent, ScrollToTop, usePopUp } from "@/components";
import { getAllProjects } from "@/functions/actions";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";


export default function Projects() {
    const router = useRouter();
    const [popUp, setPopUp] = usePopUp();
    const [keys, setKeys] = useState<string[]>([])
    useEffect(() => {
        const fetchKeys = async () => {
            const res = await getAllProjects();
        setKeys(res);
        }
        fetchKeys();
    }, [setPopUp])
    return (
        <main className="flex flex-col items-center justify-between overflow-x-clip">
            <div className="w-screen h-fit min-h-[100vh] relative flex flex-col">
                <ScrollToTop />
                <HeaderComponent/>
                <GridComponents keys={keys} max={0} showTitle={false} />
                <ScrollComponent />
                <FooterComponent/>
            </div>
        </main>
    )
}
    