"use client";

import { FooterComponent, GridComponents, HeaderComponent, ScrollComponent, ScrollToTop } from "@/components";
import { useRouter, useSearchParams } from "next/navigation";

export default function Projects({ keys }: { keys: string[] }) {
    const searchParams = useSearchParams();
    const editMode = searchParams.get("edit") === "true";

    return (
        <main className="flex flex-col items-center justify-between overflow-x-clip">
            <div className="w-screen h-fit min-h-[100vh] relative flex flex-col">
                <ScrollToTop />
                <HeaderComponent newHidden={editMode} />
                <GridComponents keys={keys} max={0} showTitle={false} editMode={editMode} />
                <ScrollComponent />
                <FooterComponent/>
            </div>
        </main>
    )
}