"use client";
import { useSearchParams } from "next/navigation";
import CaseStory from "@/components/CaseStory";
import ProjectEditor from "@/components/ProjectEditor";
import type { ProjectRecord } from "@/lib/project-content";
export type { ProjectData } from "@/lib/project-content";

export function ProjectPage({ projectKey, serverData, id, role }: { projectKey: string; serverData: ProjectRecord; id: string; role: string }) {
    const searchParams = useSearchParams();
    if (role === "admin" && searchParams.get("edit") === "true") return <ProjectEditor projectKey={projectKey} initial={serverData} />;
    return <CaseStory data={serverData} id={id} admin={role === "admin"} />;
}
