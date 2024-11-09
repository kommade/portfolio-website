import { getProjectKey, getRole, getProjectData } from "@/functions/actions";
import { Suspense } from "react";
import { FooterComponent, HeaderComponent, LoadingComponent, MessageDisplayComponent, } from "@/components";
import { ProjectPage } from "./page-client";

type Params = Promise<{ id: string }>

export default async function ProjectPageWrapper({ params }: { params: Params }) {
    const id = (await params).id;
    async function fetchData(id: string) {
        const keyRes = await getProjectKey(id);
        if (keyRes.success === false) {
            return { success: false };
        }
        const dataRes = await getProjectData(keyRes.data!);
        if (dataRes.success === false) {
            return { success: false };
        }
        return { success: true, key: keyRes.data!, data: dataRes.data! };
    }

    const { success, key, data } = await fetchData(id);

    if (!success) {
        return (
            <main className="flex flex-col items-center justify-between overflow-x-clip">
                <div className="w-screen relative flex flex-col">
                    <HeaderComponent />
                    <MessageDisplayComponent text="Whoops! Something went wrong." />
                    <FooterComponent/>
                </div>
            </main>
        );
    }

    const access = await getRole();

    return (
        <Suspense fallback={<LoadingComponent/>}>
            <ProjectPage projectKey={key!} serverData={data!} access={access} id={id} />
        </Suspense>
    )
}