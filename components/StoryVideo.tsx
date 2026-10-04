"use client";

import { useEffect, useState } from "react";
import type { StoryBlock } from "@/lib/project-content";

export default function StoryVideo({ block }: { block: Extract<StoryBlock, { type: "video" }> }) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => { setMounted(true); }, []);

    // Video extensions can insert controls before hydration. Introduce the player
    // only after React has hydrated the matching server/client placeholder.
    if (!mounted) return <div className="l-regular story-video story-video-placeholder" aria-label={block.title || "Project video"}>
        <a className="l-regular" href={block.url}>Open video</a>
    </div>;

    return <video className="l-regular story-video" src={block.url} poster={block.poster || undefined} controls playsInline preload="metadata" aria-label={block.title || "Project video"} crossOrigin="anonymous">
        {block.subtitles && <track kind="captions" src={block.subtitles} srcLang="en" label="English" default />}
        Your browser cannot play this video. <a className="l-regular" href={block.url}>Download the video</a>.
    </video>;
}
