import { Suspense } from "react";
import Projects from "./page-client";
import { getAllProjects } from "@/functions/actions";
import { LoadingComponent } from "@/components";

export const experimental_ppr = true

export default async function ProjectsWrapper() {
    'use cache';
    const keys = await getAllProjects();
    return (
        <Suspense fallback={<LoadingComponent/>}>
            <Projects keys={keys} />
        </Suspense>
    )
}