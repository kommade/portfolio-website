import { getProjectKey, getRole, getProjectData } from "@/functions/actions";
import { Suspense } from "react";
import { FooterComponent, HeaderComponent, LoadingComponent, MessageDisplayComponent, } from "@/components";
import { ProjectPage } from "./page-client";


export default async function ProjectPageWrapper({ params }: { params: { id: string } }) {
    let error = false;
    const keyRes = await getProjectKey(params.id);
    if (!keyRes.success) {
        error = true;
    }
    const dataRes = await getProjectData(keyRes.data);
    if (!dataRes.success) {
        error = true;
    }
    const access = await getRole();

    if (error) {
        return (
            <main className="flex flex-col items-center justify-between overflow-x-clip">
                <div className="w-screen relative flex flex-col">
                    <HeaderComponent />
                    <MessageDisplayComponent text="Whoops! Something went wrong." />
                    <FooterComponent/>
                </div>
            </main>
        )
    }

    return (
        <Suspense fallback={<LoadingComponent/>}>
            <ProjectPage projectKey={keyRes.data} serverData={dataRes.data} access={access} id={params.id} />
        </Suspense>
    )
}