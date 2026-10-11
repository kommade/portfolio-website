"use client";
import Link from "next/link";
import type { ProjectData } from "@/lib/project-content";
import PortfolioShell from "./PortfolioShell";
import StoryContent from "./StoryContent";
import { AdminIcon } from "./AdminControls";
import MediaCleanupNotice from "./MediaCleanupNotice";

export default function CaseStory({ data, id, admin }: { data: ProjectData; id: string; admin: boolean }) {
    return <PortfolioShell className="portfolio-story">
        {admin && <div className="story-admin-toolbar"><span className="m-regular">{data.hidden ? "Hidden · only admins can see this story" : "Admin view"}</span><Link className="l-regular admin-button" href={`/case-stories/${id}?edit=true`}>Edit<AdminIcon name="edit" /></Link></div>}
        {admin && <MediaCleanupNotice id={id} />}
        <StoryContent data={data} />
    </PortfolioShell>;
}
