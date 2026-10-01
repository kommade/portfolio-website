"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { ProjectThumbnailData } from "./GridComponents";
import PortfolioShell, { DesignChip, DesignIcon } from "./PortfolioShell";

export default function CaseStories({ projects, admin = false }: { projects: ProjectThumbnailData[]; admin?: boolean }) {
    const [selected, setSelected] = useState(0);
    const project = projects[selected] || projects[0];
    return <PortfolioShell title="Case Stories" tools={admin && <><Link href="/projects?edit=true">Edit projects</Link><Link href="/new?type=project">New project</Link></>}>
        {project ? <div className="case-list-layout">
            <div className="case-list" aria-label="Choose a case story">
                {projects.map((item, index) => <button key={item.id} type="button" aria-pressed={project.id === item.id} aria-controls="case-preview" onClick={() => setSelected(index)}>{item.name}</button>)}
            </div>
            <section id="case-preview" className="case-preview" aria-label={project.name} aria-live="polite">
                <div className="case-preview-image">{project.image && <Image src={project.image} alt={project.name} fill sizes="(max-width:800px) 90vw, 418px" priority />}</div>
                <dl className="case-facts">
                    {typeof project.sector === "string" && project.sector && <div><dt><DesignChip colour="grape">Sector</DesignChip></dt><dd>{project.sector}</dd></div>}
                    {typeof project.domain === "string" && project.domain && <div><dt><DesignChip colour="brick">Domain</DesignChip></dt><dd>{project.domain}</dd></div>}
                    <div><dt><DesignChip>Year</DesignChip></dt><dd>{project.year}</dd></div>
                </dl>
                <Link className="design-button" href={`/projects/${project.id}`}>View Case Story<DesignIcon name="arrow" /></Link>
            </section>
        </div> : <p className="case-empty l-regular">Case stories will appear here soon.</p>}
    </PortfolioShell>;
}
