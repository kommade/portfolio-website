"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { ProjectData } from "@/app/projects/[id]/page-client";
import PortfolioShell, { DesignChip } from "./PortfolioShell";
import PhotoViewer from "./PhotoViewer";

const plainText = (value: string) => value.replace(/<br\s*\/?>/gi, "\n");

function StoryText({ text }: { text: string }) {
    const parts = plainText(text).split("Click here to view the full thesis book.");
    return <p className="l-regular">{parts.map((part, index) => <span key={index}>{index > 0 && <>Click <a className="story-text-link" href="https://www.yumpu.com/en/document/view/68308775/window-to-another-world-spreads" target="_blank" rel="noopener noreferrer">here</a> to view the full thesis book.</>}{part}</span>)}</p>;
}

export default function CaseStory({ data, id, admin }: { data: ProjectData; id: string; admin: boolean }) {
    const [viewer, setViewer] = useState<number | null>(null);
    const [active, setActive] = useState("challenge");
    const { sidebar, main } = data.data;
    const sections = [{ id: "challenge", title: "The Challenge" }, ...main.body.normal.map((section,index) => ({ id: `section-${index}`, title: section.header })).filter(section => section.title)];
    if (main.body.grid.use && main.body.grid.header) sections.push({ id: "gallery", title: main.body.grid.header });
    const images = [main.cover.image, ...main.body.normal.map(section => section.image), ...(main.body.grid.use ? main.body.grid.images : [])].filter(Boolean).map((url,index) => ({ url, id: String(index), name: `${data.name} — image ${index + 1}` }));
    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            const visible = entries.find(entry => entry.isIntersecting);
            if (visible) setActive(visible.target.id);
        }, { rootMargin: "-100px 0px -55% 0px" });
        document.querySelectorAll(".story-section").forEach(section => observer.observe(section));
        return () => observer.disconnect();
    }, [data]);
    const picture = (url: string, label: string) => url && <button className="story-image" onClick={() => setViewer(images.findIndex(image => image.url === url))} aria-label={`Enlarge ${label}`}><Image src={url} alt={label} width={1200} height={800} sizes="(max-width:800px) 90vw, 911px" /></button>;
    return <PortfolioShell className="portfolio-story" tools={admin && <Link href={`/projects/${id}?edit=true`}>Edit case story</Link>}>
        <div className="story-layout">
            <article>
                <h1 className="story-title">{data.name}</h1>
                <div className="story-meta"><span>{data.year}</span>{sidebar["project-type"].length > 0 && <><span aria-hidden="true">•</span><span>{sidebar["project-type"].join(", ")}</span></>}</div>
                <div className="story-blocks">
                    <div><DesignChip colour="grape">Team</DesignChip><p className="s-light">{sidebar.team.join("\n")}</p></div>
                    <div><DesignChip colour="brick">Skillset</DesignChip><p className="s-light">{sidebar.skillset.join("\n")}</p></div>
                    <div><DesignChip>Methods</DesignChip><p className="s-light">{sidebar.approach.join("\n")}</p></div>
                </div>
                <section className="story-section" id="challenge"><h2>The Challenge</h2><StoryText text={main.cover.text} />{picture(main.cover.image,data.name)}</section>
                {main.body.normal.map((section,index) => <section className="story-section" id={`section-${index}`} key={index}>
                    {section.header && <h2>{section.header}</h2>}<StoryText text={section.text} />{picture(section.image,section.header || data.name)}
                </section>)}
                {main.body.grid.use && <section className="story-section" id="gallery">{main.body.grid.header && <h2>{main.body.grid.header}</h2>}<StoryText text={main.body.grid.text} /><div className="story-gallery">{main.body.grid.images.filter(Boolean).map((url,index) => <div key={index}>{picture(url,`${data.name} gallery ${index + 1}`)}</div>)}</div></section>}
            </article>
            <aside className="story-contents"><DesignChip colour="grape">Contents</DesignChip><nav aria-label="Case story contents">{sections.map(section => <a key={section.id} href={`#${section.id}`} aria-current={active === section.id ? "location" : undefined}>{section.title}</a>)}</nav><Link href="/projects">All case stories</Link></aside>
        </div>
        {viewer !== null && <PhotoViewer images={images} index={viewer} close={() => setViewer(null)} />}
    </PortfolioShell>;
}
