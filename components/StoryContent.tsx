"use client";

import { useEffect, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { safeLink, storyBlocks, type ProjectData, type StoryBlock, type StoryCard } from "@/lib/project-content";
import { DesignChip, DesignIcon } from "./PortfolioShell";
import PhotoViewer from "./PhotoViewer";
import { Card } from "./ui/card";
import { balancedGalleryRows } from "@/lib/gallery-layout";
import { parseCountUpValue } from "@/lib/count-up";
import CountUpTo from "./CountUpTo";
import { sectionAnchors } from "@/lib/section-anchors";
import StoryVideo from "./StoryVideo";

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

type StoryPicture = (url: string, alt: string, loaded?: (width: number, height: number) => void) => ReactNode;

function StoryGallery({ block, picture }: { block: Extract<StoryBlock, { type: "gallery" }>; picture: StoryPicture }) {
    const [ratios, setRatios] = useState<Record<string, number>>({});
    const images = block.images.filter(image => image.url);
    const ratio = (url: string) => ratios[url] || 1.5;
    // Only measured image proportions are dynamic; layout rules stay in globals.css.
    return <div className="story-gallery" style={{ "--gallery-max-ratio": Math.max(1, ...images.map(image => ratio(image.url))) } as CSSProperties}>
        {balancedGalleryRows(images).map((row, rowIndex) => <div className={`story-gallery-row story-gallery-row-${row.length}`} key={rowIndex} style={{ "--gallery-ratio": row.reduce((sum, image) => sum + ratio(image.url), 0) } as CSSProperties}>
            {row.map((item, index) => <figure className="story-media" key={`${item.url}-${index}`} style={{ "--image-ratio": ratio(item.url) } as CSSProperties}>
                {picture(item.url, item.alt, (width, height) => {
                    if (!height) return;
                    const value = width / height;
                    setRatios(current => current[item.url] === value ? current : { ...current, [item.url]: value });
                })}
                {item.caption && <figcaption><RichText typography="m-light" text={item.caption} /></figcaption>}
            </figure>)}
        </div>)}
    </div>;
}

function CardValue({ card }: { card: StoryCard }) {
    const number = card.countUp && parseCountUpValue(card.value);
    return <p className="h3 story-stat-value">{number ? <CountUpTo key={card.value} {...number} finalText={card.value.trim()} /> : card.value}</p>;
}

export function StoryBlockView({ block, picture, anchorId }: { block: StoryBlock; picture: StoryPicture; anchorId?: string }) {
    switch (block.type) {
        case "heading": return <section id={anchorId || sectionAnchors([block]).get(block.id)} className="story-section story-heading"><h2 className="h4">{block.text}</h2></section>;
        case "text": return <RichText text={block.text} />;
        case "image": return <figure className="story-media">{picture(block.image.url, block.image.alt)}{block.image.caption && <figcaption><RichText typography="m-light" text={block.image.caption} /></figcaption>}</figure>;
        case "gallery": return <StoryGallery block={block} picture={picture} />;
        case "video": return block.url ? <figure className="story-media"><StoryVideo block={block} />{block.caption && <figcaption><RichText typography="m-light" text={block.caption} /></figcaption>}</figure> : null;
        case "button": return <div className="story-action">{safeLink(block.href) ? <a className="l-regular design-button" href={block.href} target={block.newTab ? "_blank" : undefined} rel="noopener noreferrer">{block.label}<DesignIcon name="arrow" /></a> : <span className="l-regular design-button" aria-disabled="true">{block.label}<DesignIcon name="arrow" /></span>}</div>;
        case "cards": return <div className="story-outcomes"><div className="story-card-grid">{block.cards.map(card => <Card className={`story-stat story-stat-${card.colour}`} key={card.id}>
            <CardValue card={card} /><RichText typography="l-light" text={card.text} />
        </Card>)}</div>{block.caption && <div className="story-card-caption"><RichText typography="m-light" text={block.caption} /></div>}</div>;
    }
}

export default function StoryContent({ data }: { data: ProjectData }) {
    const blocks = storyBlocks(data);
    const [viewer, setViewer] = useState<number | null>(null);
    const [active, setActive] = useState("");
    const { sidebar } = data.data;
    const sections = blocks.filter((block): block is Extract<StoryBlock, { type: "heading" }> => block.type === "heading");
    const anchors = sectionAnchors(sections);
    const images = blocks.flatMap(block => block.type === "image" ? [block.image] : block.type === "gallery" ? block.images : []).filter(item => item.url).map((item, index) => ({ url: item.url, name: item.alt || data.name, id: String(index) }));
    useEffect(() => {
        const observer = new IntersectionObserver(entries => { const visible = entries.find(entry => entry.isIntersecting); if (visible) setActive(visible.target.id); }, { rootMargin: "-100px 0px -55% 0px" });
        document.querySelectorAll(".story-heading").forEach(section => observer.observe(section));
        return () => observer.disconnect();
    }, [data]);
    const picture: StoryPicture = (url, label, loaded) => url && <button type="button" className="story-image" onClick={() => setViewer(images.findIndex(image => image.url === url))} aria-label={`Enlarge ${label || "story image"}`}><Image src={url} alt={label} width={1200} height={800} sizes="(max-width:800px) 90vw, 911px" onLoad={event => loaded?.(event.currentTarget.naturalWidth, event.currentTarget.naturalHeight)} /></button>;
    return <><div className="story-layout">
        <article className="story-article">
            <h1 className="h3 story-title">{data.name || "Untitled case story"}</h1>
            <div className="story-meta"><span className="l-regular">{data.year}</span>{sidebar["project-type"].length > 0 && <><span className="l-regular" aria-hidden="true">•</span><span className="l-regular">{sidebar["project-type"].join(", ")}</span></>}</div>
            <div className="story-blocks">
                <div><DesignChip colour="grape">{sidebar.labels?.team || "Team"}</DesignChip><p className="s-light">{sidebar.team.join("\n")}</p></div>
                <div><DesignChip colour="brick">{sidebar.labels?.skillset || "Skillset"}</DesignChip><p className="s-light">{sidebar.skillset.join("\n")}</p></div>
                <div><DesignChip>{sidebar.labels?.approach || "Methods"}</DesignChip><p className="s-light">{sidebar.approach.join("\n")}</p></div>
            </div>
            <div className="story-body">{blocks.map(block => <StoryBlockView key={block.id} block={block} picture={picture} anchorId={anchors.get(block.id)} />)}</div>
        </article>
        <aside className="story-contents"><DesignChip colour="grape">Contents</DesignChip><nav aria-label="Case story contents">{sections.map(section => <a className="m-light" key={section.id} href={`#${anchors.get(section.id)}`} aria-current={active === anchors.get(section.id) ? "location" : undefined}>{section.text}</a>)}</nav><Link className="m-light" href="/projects">All case stories</Link></aside>
    </div>{viewer !== null && images[viewer] && <PhotoViewer images={images} index={viewer} close={() => setViewer(null)} />}</>;
}
