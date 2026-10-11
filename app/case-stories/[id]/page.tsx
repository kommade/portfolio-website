import { getProjectKey, getProjectData, getAllProjectIds } from "@/functions/db";
import { ProjectPage } from "./page-client";
import { getRole } from "@/functions/actions";
import { isHidden } from "@/lib/project-content";
import { notFound } from "next/navigation";
import PortfolioShell from "@/components/PortfolioShell";
import MagicKeyForm from "@/components/MagicKeyForm";

export function generateStaticParams() {
    // Keep one sample route for Cache Components if every project is hidden.
    return getAllProjectIds().then(ids => (ids.length ? ids : ["__empty"]).map(id => ({ id })));
}

export default async function ProjectPageWrapper({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const role = await getRole();
    const key = await getProjectKey(id);
    if (!key.success) notFound();
    const result = await getProjectData(key.data!);
    if (!result.success || !result.data || (isHidden(result.data.hidden) && role !== "admin")) notFound();
    if (result.data.access === "member" && role !== "member" && role !== "admin") {
        return <PortfolioShell title="Case Stories" mutedTitle><MagicKeyForm redirect={`/case-stories/${id}`} /></PortfolioShell>;
    }
    return <ProjectPage projectKey={key.data!} serverData={result.data} id={id} role={role} />;
}
