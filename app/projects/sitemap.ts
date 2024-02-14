import { getAllProjects, getProjectId } from "@/functions/actions"
import { MetadataRoute } from "next"
 
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
        const keys = await getAllProjects()
        const projects = await Promise.all(keys.map((key) => getProjectId(key)));
        return projects.map((project) => ({
                url: `https://juliettekhoo.com/projects/${project.data}`,
                lastModified: new Date()
        }))
}