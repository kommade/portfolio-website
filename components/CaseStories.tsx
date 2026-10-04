"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import type { ProjectThumbnailData } from "./GridComponents";
import { deleteProject, setProjectHidden } from "@/functions/project-actions";
import { discardProjectMedia } from "@/functions/media-actions";
import { isHidden } from "@/lib/project-content";
import PortfolioShell, { DesignChip, DesignIcon } from "./PortfolioShell";
import { AdminIcon, ConfirmDialog } from "./AdminControls";

export default function CaseStories({ projects, admin = false }: { projects: ProjectThumbnailData[]; admin?: boolean }) {
    const [selected, setSelected] = useState("");
    const params = useSearchParams();
    const [editing, setEditing] = useState(admin && params.get("edit") === "true");
    const [deleting, setDeleting] = useState<ProjectThumbnailData | null>(null);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");
    const [status, setStatus] = useState("");
    const [cleanupPending, setCleanupPending] = useState<string[]>([]);
    const router = useRouter();
    const project = projects.find(item => item.id === selected) || projects[0];
    const mutate = async (action: () => Promise<{ success: boolean; message?: string; cleanupPending?: string[] }>, message: string) => {
        setBusy(true); setError(""); setStatus("");
        try {
            const result = await action();
            if (!result.success) { setError(result.message || "Unable to update this story."); return; }
            if (result.cleanupPending?.length) {
                setCleanupPending(pending => [...new Set([...pending, ...result.cleanupPending!])]);
                setError("The project was deleted, but some unused files could not be removed. Retry file cleanup.");
            }
            setDeleting(null); setStatus(message); router.refresh();
        } catch { setError("Unable to update. Please try again."); }
        finally { setBusy(false); }
    };
    return <PortfolioShell title="Case Stories">
        {(error || status) && <p className={error ? "m-regular case-admin-message editor-error" : "m-regular case-admin-message"} role={error ? "alert" : "status"}>{error || status}</p>}
        {admin && cleanupPending.length > 0 && <div className="case-admin-message"><button className="l-regular admin-button" type="button" disabled={busy} onClick={() => mutate(async () => { const result = await discardProjectMedia(cleanupPending); setCleanupPending(result.pending); return result; }, "Unused files deleted.")}>Retry file cleanup</button></div>}
        <div className="case-list-layout">
            <div>
                {admin && <div className="case-admin-toolbar"><Link className="l-regular admin-button admin-primary" href="/new?type=project">New Page<AdminIcon name="new-page" /></Link><button className="l-regular admin-button" type="button" onClick={() => setEditing(!editing)} aria-pressed={editing}>{editing ? "Done" : "Edit"}<AdminIcon name="edit" /></button></div>}
                <div className="case-story-list" aria-label="Choose a case story">{projects.map(item => <div className="case-story-row" key={item.id}>
                    <button className="h5 case-story-select" type="button" aria-pressed={project?.id === item.id} aria-controls="case-preview" onClick={() => setSelected(item.id)}>{item.name}{admin && isHidden(item.hidden) && <span className="s-regular admin-hidden-badge"><EyeOff />Hidden</span>}</button>
                    {admin && editing && <button className="admin-icon-button" type="button" aria-label={`Delete ${item.name}`} disabled={busy} onClick={() => setDeleting(item)}><AdminIcon name="trash" /></button>}
                </div>)}</div>
                {!project && <p className="l-regular editor-empty">{admin ? "Create your first case story with New Page." : "Case stories will appear here soon."}</p>}
            </div>
            {project && <section id="case-preview" className="case-preview" aria-label={project.name} aria-live="polite">
                <div className="case-preview-image">{project.image && <Image src={project.image} alt={project.name} fill sizes="(max-width:800px) 90vw, 418px" priority />}</div>
                <dl className="case-facts">
                    {typeof project.sector === "string" && project.sector && <div><dt><DesignChip colour="grape">Sector</DesignChip></dt><dd className="m-regular">{project.sector}</dd></div>}
                    {typeof project.domain === "string" && project.domain && <div><dt><DesignChip colour="brick">Domain</DesignChip></dt><dd className="m-regular">{project.domain}</dd></div>}
                    <div><dt><DesignChip>Year</DesignChip></dt><dd className="m-regular">{project.year}</dd></div>
                </dl>
                <Link className="l-regular design-button" href={`/projects/${project.id}`}>View Case Story<DesignIcon name="arrow" /></Link>
                {admin && <div className="case-preview-admin"><Link className="l-regular admin-button" href={`/projects/${project.id}?edit=true`}>Edit story<AdminIcon name="edit" /></Link><button className="l-regular admin-button" disabled={busy} type="button" onClick={() => mutate(() => setProjectHidden(project.id, !isHidden(project.hidden)), isHidden(project.hidden) ? "Project shown to visitors." : "Project hidden from visitors.")}>{isHidden(project.hidden) ? <Eye /> : <EyeOff />}{isHidden(project.hidden) ? "Show project" : "Hide project"}</button><p className="s-regular editor-help">{isHidden(project.hidden) ? "Only admins can see this project, including at its direct URL." : "Hidden projects remain available to admins."}</p></div>}
            </section>}
        </div>
        {deleting && <ConfirmDialog title={`Delete “${deleting.name}”?`} busy={busy} close={() => setDeleting(null)} confirm={() => mutate(() => deleteProject(deleting.id), "Project and unused uploads deleted.")}><p className="l-regular">This permanently removes the story and its uploaded files. Files used by other stories are kept. You can hide the story instead if you want to keep it for later.</p>{error && <p className="m-regular editor-error" role="alert">{error}</p>}</ConfirmDialog>}
    </PortfolioShell>;
}
