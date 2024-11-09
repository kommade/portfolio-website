import { getAllProjects } from "@/functions/actions";
import { Suspense } from "react";
import Home from "./page-client";
import { LoadingComponent } from "@/components";

export const experimental_ppr = true

async function HomeWrapper() {
    'use cache';
    const keys = await getAllProjects();
    return (
        <Suspense fallback={<LoadingComponent/>}>
            <Home keys={keys} />
        </Suspense>
    )
}


export default HomeWrapper;
