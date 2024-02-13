import { getAllProjects } from "@/functions/actions";
import { Suspense } from "react";
import Home from "./page-client";
import { LoadingComponent } from "@/components";

async function HomeWrapper() {
    const keys = await getAllProjects();
    return (
        <Suspense fallback={<LoadingComponent/>}>
            <Home keys={keys} />
        </Suspense>
    )
}


export default HomeWrapper;
