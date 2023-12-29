'use client';

import React, { useState } from 'react';
import useWindowSize from "@/hooks/useWindowSize";

interface GridComponentProps {
    popup: string;
    title: string;
    year: string;
    img?: string;
    row?: number;
    col?: number;
}

const GridComponent: React.FC<GridComponentProps> = ({ popup, title, year, img = "https://via.placeholder.com/510x412", row = 1, col = 1 }) => {
    const { width } = useWindowSize();
    const isLargeScreen = width >= 1024; 
    const adjustedCol = isLargeScreen ? col : 1;
    const [isHovered, setIsHovered] = useState(false);
    const span = {
        gridRow: row > 1 ? `span 2` : 'auto',
        gridColumn: adjustedCol > 1 ? `span 2` : 'auto',
        aspectRatio: (() => {
            let gap = 24;
            if (width >= 1536) {
                gap = 40;
            } else if (width >= 1280) {
                gap = 32;
            }
            gap -= 3 // no clue why but it fixes the widths of everything
            const blockWidth = (width * 0.85) / 3 - 2 * gap;
            if (adjustedCol > 1) {
                return `${2 * blockWidth + gap} / ${blockWidth}`
            } else if (row > 1) {
                return `${blockWidth} / ${2 * blockWidth + gap}`
            } else {
                return '1/1'
            }
        })(),
    };

    return (
        <article className="bg-white relative overflow-hidden border-2 border-neutral-400" style={span}>
            <section className="absolute inset-2 inset-y-0 border-2 border-neutral-400 bottom-[20%] top-2"
                onMouseOver={() => setIsHovered(true)}
                onMouseOut={() => setIsHovered(false)}
            >
                <img className={`object-cover object-left w-full h-full absolute transition-all ${isHovered ? ' blur-[2px]' : ''}`} src={img} />
                <p className={`popup w-full h-full absolute flex p-20 items-center justify-center text-center transition-all text-black text-sm font-normal font-['Epilogue'] leading-[0.85rem] ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                {popup}
                </p>
            </section>
            <section className="top-[80%] absolute left-2">
                <h1 className="grid-title">{title}</h1>
                <h2 className="grid-year">{year}</h2>
            </section>
        </article>
    );
}

export default GridComponent;