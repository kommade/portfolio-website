import Projects from "./page-client";
import { getAllProjects, getProjectThumbnail } from "@/functions/actions";

export const experimental_ppr = true

export default async function ProjectsWrapper() {
    'use cache';
    const keys = await getAllProjects();
    const res = await Promise.all(keys.map(getProjectThumbnail));
    return (
        <Projects keys={keys} response={res}/>
    )
}