import Projects from "./page-client";
import { getAllProjects, getProjectThumbnail } from "@/functions/db";
import { getRole } from "@/functions/actions";

export default async function ProjectsWrapper() {
    const keys = await getAllProjects();
    const res = await Promise.all(keys.map(getProjectThumbnail));
    const role = await getRole();
    return (
        <Projects keys={keys} response={res} admin={role === "admin"}/>
    )
}
