import Projects from "./page-client";
import { getAllProjects, getProjectThumbnail } from "@/functions/db";

export default async function ProjectsWrapper() {
    'use cache';
    const keys = await getAllProjects();
    const res = await Promise.all(keys.map(getProjectThumbnail));
    return (
        <Projects keys={keys} response={res}/>
    )
}