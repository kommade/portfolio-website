import { getAllProjects, getProjectThumbnail } from "@/functions/actions";
import Home from "./page-client";

export const experimental_ppr = true

async function HomeWrapper() {
    'use cache';
    const keys = await getAllProjects();
    const res = await Promise.all(keys.map(getProjectThumbnail));
    return (
        <Home keys={keys} response={res}/>
    )
}


export default HomeWrapper;
