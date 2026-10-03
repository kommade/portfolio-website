"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { FunStuffData } from "@/app/fun-stuff/page-client";
import PortfolioShell from "./PortfolioShell";
import PhotoViewer, { type GalleryImage } from "./PhotoViewer";

const categories = [
    { key: "photography", label: "Photography" },
    { key: "interaction", label: "Interaction" },
    { key: "craft", label: "Finished Objects" },
    { key: "sketchbook", label: "Sketchbook" },
] as const;

export default function Explorations({ data, admin }: { data: FunStuffData; admin: boolean }) {
    const [category, setCategory] = useState<(typeof categories)[number]["key"]>("photography");
    const [viewer, setViewer] = useState<number | null>(null);
    const images = (data[category] || []).filter((item): item is GalleryImage => !!item?.url);
    return <PortfolioShell title="Explorations" tools={admin && <><Link className="m-regular" href="/fun-stuff?edit=true">Edit explorations</Link><Link className="m-regular" href="/new?type=funstuff">New exploration</Link></>}>
        <div className="exploration-layout">
            {images.length ? <div className="exploration-grid" id="exploration-gallery" aria-label={categories.find(item => item.key === category)?.label}>
                {images.map((item,index) => <button className="exploration-tile" key={item.id} onClick={() => setViewer(index)} aria-label={`View ${item.name}`}>
                    <Image src={item.url} alt={item.name} fill sizes="(max-width:800px) 45vw, 500px" priority={index < 3} />
                </button>)}
            </div> : <p className="exploration-empty l-regular" id="exploration-gallery" role="status">New explorations are on their way.</p>}
            <nav className="case-list exploration-categories" aria-label="Exploration categories">
                {categories.map(item => <button className="h5" key={item.key} aria-pressed={category === item.key} aria-controls="exploration-gallery" onClick={() => setCategory(item.key)}>{item.label}</button>)}
            </nav>
        </div>
        {viewer !== null && <PhotoViewer images={images} index={viewer} close={() => setViewer(null)} />}
    </PortfolioShell>;
}
