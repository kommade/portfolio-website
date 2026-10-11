"use client";

import { useId, useState, type ReactNode } from "react";
import type { ImageToggleOption, StoryImage } from "@/lib/project-content";

export default function ImageToggle({ options, renderImage, renderCaption }: {
    options: [ImageToggleOption, ImageToggleOption];
    renderImage: (image: StoryImage, index: number) => ReactNode;
    renderCaption: (text: string) => ReactNode;
}) {
    const [selected, setSelected] = useState(0);
    const panelId = useId();
    const active = options[selected].image.url ? selected : options.findIndex(option => option.image.url);
    const option = options[active];

    return <div className="story-image-toggle">
        <div className="story-image-toggle-controls" role="group" aria-label="Choose image">
            {options.map((option, index) => <button className="m-regular story-image-toggle-button" key={index} type="button" aria-pressed={active === index} aria-controls={panelId} disabled={!option.image.url} onClick={() => setSelected(index)}>{option.label}</button>)}
        </div>
        <figure className="story-media" id={panelId} aria-label={option?.label}>
            {option && renderImage(option.image, active)}
            {option?.image.caption && <figcaption>{renderCaption(option.image.caption)}</figcaption>}
        </figure>
    </div>;
}
