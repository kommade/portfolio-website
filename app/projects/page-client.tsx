"use client";

import { FooterComponent, GridComponents, HeaderComponent, ScrollComponent, ScrollToTop } from "@/components";
import { ProjectThumbnailResponse } from "@/components/GridComponents";
import { useSearchParams } from "next/navigation";

type ProjectProps = {
    keys: string[];
    response: ProjectThumbnailResponse;
};

export default function Projects({ keys, response }: ProjectProps) {
    const searchParams = useSearchParams();
    const editMode = searchParams.get("edit") === "true";

    return (
        <main className="flex flex-col items-center justify-between overflow-x-clip">
            <div className="w-screen h-fit min-h-[100vh] relative flex flex-col">
                <ScrollToTop />
                <HeaderComponent newHidden={editMode} />
                <GridComponents keys={keys} response={response} max={0} showTitle={false} editMode={editMode} />
                <ScrollComponent />
                <FooterComponent/>
            </div>
        </main>
    )
}