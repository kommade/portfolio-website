import Projects from "./page-client";
import { getAllProjects } from "@/functions/actions";

export const experimental_ppr = true

export default async function ProjectsWrapper() {
    'use cache';
    const keys = await getAllProjects();
    return (
        <Projects keys={keys} />
    )
}