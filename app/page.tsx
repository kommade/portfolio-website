import { getAllProjects, getProjectThumbnail } from "@/functions/db";
import Home from "./page-client";

async function HomeWrapper() {
    'use cache';
    const keys = await getAllProjects();
    const res = await Promise.all(keys.map(getProjectThumbnail));
    return (
        <Home keys={keys} response={res}/>
    )
}


export default HomeWrapper;
