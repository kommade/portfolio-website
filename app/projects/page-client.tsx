"use client";
import CaseStories from "@/components/CaseStories";
import type { ProjectThumbnailData, ProjectThumbnailResponse } from "@/components/GridComponents";

export default function Projects({ response, admin = false }: { keys: string[]; response: ProjectThumbnailResponse; admin?: boolean }) {
    return <CaseStories projects={response.flatMap(result => result.success && result.data ? [result.data as ProjectThumbnailData] : [])} admin={admin} />;
}
