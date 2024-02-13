import { Suspense } from "react";
import Projects from "./page-client";
import { getAllProjects } from "@/functions/actions";
import { LoadingComponent } from "@/components";


export default async  function ProjectsWrapper() {
    const keys = await getAllProjects();
    return (
        <Suspense fallback={<LoadingComponent/>}>
            <Projects keys={keys} />
        </Suspense>
    )
}