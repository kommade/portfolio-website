import { getAllProjects, getProjectThumbnail } from "@/functions/db";
import { getRole } from "@/functions/actions";
import { isHidden } from "@/lib/project-content";
import CaseStories from "@/components/CaseStories";
import type { ProjectThumbnailData } from "@/components/GridComponents";

export default async function ProjectsWrapper() {
    const role = await getRole();
    const responses = await Promise.all((await getAllProjects()).map(getProjectThumbnail));
    const projects = responses.flatMap(result => result.success && result.data?.id && (role === "admin" || !isHidden(result.data.hidden)) ? [result.data as ProjectThumbnailData] : []);
    return <CaseStories projects={projects} admin={role === "admin"} />;
}
