import { New } from "./page-client";
import { getRole } from "@/functions/actions";
import { redirect } from "next/navigation";
import ProjectEditor from "@/components/ProjectEditor";
import { blankProject } from "@/lib/project-content";

export default async function NewWrapper({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
    if (await getRole() !== "admin") redirect("/login?mode=admin&redirect=/new");
    return (await searchParams).type === "funstuff" ? <New /> : <ProjectEditor initial={blankProject()} />;
}
