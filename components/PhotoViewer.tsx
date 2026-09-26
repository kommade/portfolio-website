"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export type GalleryImage = { url: string; name: string; id: string };

export default function PhotoViewer({ images, index, close }: { images: GalleryImage[]; index: number; close: () => void }) {
    const dialog = useRef<HTMLDialogElement>(null);
    const scroll = useRef<HTMLDivElement>(null);
    const [current, setCurrent] = useState(index);
    const closeRef = useRef(close);
    closeRef.current = close;
    const go = (next: number) => {
        const child = scroll.current?.children[next] as HTMLElement | undefined;
        if (child && scroll.current) scroll.current.scrollTo({ top: child.offsetTop - scroll.current.offsetTop, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
    };
    useEffect(() => {
        const element = dialog.current!;
        const previousFocus = document.activeElement as HTMLElement | null;
        const overflow = document.body.style.overflow;
        element.showModal();
        document.body.style.overflow = "hidden";
        const child = scroll.current?.children[index] as HTMLElement | undefined;
        if (child && scroll.current) scroll.current.scrollTop = child.offsetTop - scroll.current.offsetTop;
        const observer = new IntersectionObserver(entries => {
            for (const entry of entries) if (entry.isIntersecting) setCurrent(Number((entry.target as HTMLElement).dataset.index));
        }, { root: scroll.current, threshold: .5 });
        Array.from(scroll.current?.children || []).forEach(child => observer.observe(child));
        return () => { observer.disconnect(); element.close(); document.body.style.overflow = overflow; previousFocus?.focus(); };
    }, [index]);
    return <dialog ref={dialog} className="photo-viewer" aria-label="Photo viewer" onCancel={event => { event.preventDefault(); closeRef.current(); }} onKeyDown={event => {
        if (event.key === "ArrowDown" || event.key === "ArrowRight") { event.preventDefault(); go(Math.min(images.length - 1, current + 1)); }
        if (event.key === "ArrowUp" || event.key === "ArrowLeft") { event.preventDefault(); go(Math.max(0, current - 1)); }
    }}>
        <button autoFocus className="photo-close" aria-label="Close photo viewer" onClick={close}><Image src="/design/1199-818-imgX1.svg" width={28} height={28} alt="" /></button>
        <div ref={scroll} className="photo-scroll">
            {images.map((item, i) => <figure className="photo-slide" key={`${item.id}-${i}`} data-index={i}>
                <Image src={item.url} alt={item.name} width={1200} height={1600} sizes="(max-width:800px) 85vw, 960px" priority={i === index} />
            </figure>)}
        </div>
        <div className="photo-controls">
            <button aria-label="Previous photo" disabled={current === 0} onClick={() => go(current - 1)}><Image src="/design/1199-818-imgLucideMoveUp.svg" width={24} height={24} alt="" /></button>
            <p className="photo-count" aria-live="polite" aria-label={`Photo ${current + 1} of ${images.length}`}><span>{String(current + 1).padStart(2,"0")}</span><span>{String(images.length).padStart(2,"0")}</span></p>
            <button aria-label="Next photo" disabled={current === images.length - 1} onClick={() => go(current + 1)}><Image src="/design/1199-818-imgLucideMoveDown.svg" width={24} height={24} alt="" /></button>
        </div>
    </dialog>;
}
