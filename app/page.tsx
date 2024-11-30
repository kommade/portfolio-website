import { getAllProjects } from "@/functions/actions";
import Home from "./page-client";

export const experimental_ppr = true

async function HomeWrapper() {
    'use cache';
    const keys = await getAllProjects();
    return (
        <Home keys={keys} />
    )
}


export default HomeWrapper;
