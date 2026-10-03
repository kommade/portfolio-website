"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { safeLink, storyBlocks, type ProjectData, type StoryBlock } from "@/lib/project-content";
import { DesignChip, DesignIcon } from "./PortfolioShell";
import PhotoViewer from "./PhotoViewer";
import { Card } from "./ui/card";

// A small, deliberately restricted format: never render stored HTML as executable markup.
export function RichText({ text, typography = "l-regular" }: { text: string; typography?: "l-regular" | "l-light" | "m-light" }) {
    const inline = (value: string): ReactNode[] => value.split(/(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^\s]+\))/g).map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) return <strong className={`${typography} text-bold`} key={i}>{part.slice(2, -2)}</strong>;
        if (part.startsWith("*") && part.endsWith("*")) return <em className={`${typography} text-italic`} key={i}>{part.slice(1, -1)}</em>;
        const link = /^\[([^\]]+)\]\(([^\s]+)\)$/.exec(part);
        if (link && safeLink(link[2])) return <a key={i} className={`story-text-link ${typography}`} href={link[2]} target={link[2].startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">{link[1]}</a>;
        return part;
    });
    return <div className="story-rich-text">{text.replace(/<br\s*\/?>/gi, "\n").split(/\n\s*\n/).map((paragraph, i) => paragraph.split("\n").every(line => line.startsWith("- ")) ?
        <ul className={typography} key={i}>{paragraph.split("\n").map((line, j) => <li className={typography} key={j}>{inline(line.slice(2))}</li>)}</ul> : <p className={typography} key={i}>{inline(paragraph)}</p>)}</div>;
}

export function StoryBlockView({ block, picture }: { block: StoryBlock; picture: (url: string, alt: string) => ReactNode }) {
    switch (block.type) {
        case "heading": return <section id={block.id} className="story-section story-heading"><h2 className="h4">{block.text}</h2></section>;
        case "text": return <RichText text={block.text} />;
        case "image": return <figure className="story-media">{picture(block.image.url, block.image.alt)}{block.image.caption && <figcaption><RichText typography="m-light" text={block.image.caption} /></figcaption>}</figure>;
        case "gallery": return <div className="story-gallery">{block.images.map((item, index) => <figure className="story-media" key={index}>{picture(item.url, item.alt)}{item.caption && <figcaption><RichText typography="m-light" text={item.caption} /></figcaption>}</figure>)}</div>;
        case "video": return block.url ? <figure className="story-media"><video className="l-regular story-video" src={block.url} poster={block.poster || undefined} controls playsInline preload="metadata" aria-label={block.title || "Project video"} crossOrigin="anonymous">
            {block.subtitles && <track kind="captions" src={block.subtitles} srcLang="en" label="English" default />}
            Your browser cannot play this video. <a className="l-regular" href={block.url}>Download the video</a>.
        </video>{block.caption && <figcaption><RichText typography="m-light" text={block.caption} /></figcaption>}</figure> : null;
        case "button": return <div className="story-action">{safeLink(block.href) ? <a className="l-regular design-button" href={block.href} target={block.newTab ? "_blank" : undefined} rel="noopener noreferrer">{block.label}<DesignIcon name="arrow" /></a> : <span className="l-regular design-button" aria-disabled="true">{block.label}<DesignIcon name="arrow" /></span>}</div>;
        case "cards": return <div className="story-outcomes"><div className="story-card-grid">{block.cards.map(card => <Card className={`story-stat story-stat-${card.colour}`} key={card.id}>
            <p className="h3 story-stat-value">{card.value}</p><RichText typography="l-light" text={card.text} />
        </Card>)}</div>{block.caption && <div className="story-card-caption"><RichText typography="m-light" text={block.caption} /></div>}</div>;
    }
}

export default function StoryContent({ data }: { data: ProjectData }) {
    const blocks = storyBlocks(data);
    const [viewer, setViewer] = useState<number | null>(null);
    const [active, setActive] = useState("");
    const { sidebar } = data.data;
    const sections = blocks.filter((block): block is Extract<StoryBlock, { type: "heading" }> => block.type === "heading");
    const images = blocks.flatMap(block => block.type === "image" ? [block.image] : block.type === "gallery" ? block.images : []).filter(item => item.url).map((item, index) => ({ url: item.url, name: item.alt || data.name, id: String(index) }));
    useEffect(() => {
        const observer = new IntersectionObserver(entries => { const visible = entries.find(entry => entry.isIntersecting); if (visible) setActive(visible.target.id); }, { rootMargin: "-100px 0px -55% 0px" });
        document.querySelectorAll(".story-heading").forEach(section => observer.observe(section));
        return () => observer.disconnect();
    }, [data]);
    const picture = (url: string, label: string) => url && <button type="button" className="story-image" onClick={() => setViewer(images.findIndex(image => image.url === url))} aria-label={`Enlarge ${label || "story image"}`}><Image src={url} alt={label} width={1200} height={800} sizes="(max-width:800px) 90vw, 911px" /></button>;
    return <><div className="story-layout">
        <article className="story-article">
            <h1 className="h3 story-title">{data.name || "Untitled case story"}</h1>
            <div className="story-meta"><span className="l-regular">{data.year}</span>{sidebar["project-type"].length > 0 && <><span className="l-regular" aria-hidden="true">•</span><span className="l-regular">{sidebar["project-type"].join(", ")}</span></>}</div>
            <div className="story-blocks">
                <div><DesignChip colour="grape">{sidebar.labels?.team || "Team"}</DesignChip><p className="s-light">{sidebar.team.join("\n")}</p></div>
                <div><DesignChip colour="brick">{sidebar.labels?.skillset || "Skillset"}</DesignChip><p className="s-light">{sidebar.skillset.join("\n")}</p></div>
                <div><DesignChip>{sidebar.labels?.approach || "Methods"}</DesignChip><p className="s-light">{sidebar.approach.join("\n")}</p></div>
            </div>
            <div className="story-body">{blocks.map(block => <StoryBlockView key={block.id} block={block} picture={picture} />)}</div>
        </article>
        <aside className="story-contents"><DesignChip colour="grape">Contents</DesignChip><nav aria-label="Case story contents">{sections.map(section => <a className="m-light" key={section.id} href={`#${section.id}`} aria-current={active === section.id ? "location" : undefined}>{section.text}</a>)}</nav><Link className="m-light" href="/projects">All case stories</Link></aside>
    </div>{viewer !== null && images[viewer] && <PhotoViewer images={images} index={viewer} close={() => setViewer(null)} />}</>;
}
