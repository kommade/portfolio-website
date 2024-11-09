import { getProjectKey, getProjectData, getAllProjectIds } from "@/functions/actions";
import { Suspense } from "react";
import { FooterComponent, HeaderComponent, LoadingComponent, MessageDisplayComponent, } from "@/components";
import { ProjectPage } from "./page-client";

export function generateStaticParams() {
    return getAllProjectIds().then(ids => ids.map(id => ({ id })));
}

export const experimental_ppr = true

type Params = Promise<{ id: string }>

async function fetchData(id: string) {
    "use cache";
    const keyRes = await getProjectKey(id);
    if (keyRes.success === false) {
        return { success: false};
    }
    const dataRes = await getProjectData(keyRes.data!);
    if (dataRes.success === false) {
        return { success: false};
    }
    return { success: true, key: keyRes.data!, data: dataRes.data!};
}

async function DataFetcher({ id }: { id: Promise<string> }) {
    const { success, key, data } = await fetchData(await id);
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
    return (
        <Suspense fallback={<LoadingComponent />}>
            <ProjectPage projectKey={key!} serverData={data!} id={await id} />
        </Suspense>
    );
}

export default async function ProjectPageWrapper({ params }: { params: Params }) {
    return (
        <Suspense fallback={<LoadingComponent />}>
            <DataFetcher id={params.then(p => p.id)} />
        </Suspense>
    );
}