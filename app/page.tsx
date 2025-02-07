import { getAllProjects, getProjectThumbnail } from "@/functions/db";
import Home from "./page-client";
import { MessageDisplayComponent } from "@/components";

async function HomeWrapper() {
    'use cache';
    return <main className="flex flex-col items-center justify-between overflow-x-clip">
        <div className="w-screen relative flex flex-col">
            <MessageDisplayComponent text="This site is currently under maintenance! Check back later for updates."/>
        </div>
    </main>
    const keys = await getAllProjects();
    const res = await Promise.all(keys.map(getProjectThumbnail));
    return (
        <Home keys={keys} response={res}/>
    )
}


export default HomeWrapper;
