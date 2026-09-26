"use client";

import { FooterComponent, GridComponents, HeaderComponent, ScrollComponent, ScrollToTop } from "@/components";
import { ProjectThumbnailResponse } from "@/components/GridComponents";
import { useSearchParams } from "next/navigation";
import CaseStories from "@/components/CaseStories";
import type { ProjectThumbnailData } from "@/components/GridComponents";

type ProjectProps = {
    keys: string[];
    response: ProjectThumbnailResponse;
    admin?: boolean;
};

export default function Projects({ keys, response, admin = false }: ProjectProps) {
    const searchParams = useSearchParams();
    const editMode = searchParams.get("edit") === "true";

    if (!editMode) return <CaseStories projects={response.flatMap(r => r.success && r.data ? [r.data as ProjectThumbnailData] : [])} admin={admin} />;

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
