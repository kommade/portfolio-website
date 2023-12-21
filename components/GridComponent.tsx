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
            if (adjustedCol > 1) {
                return '45/22'
            } else if (row > 1) {
                return '22/45'
            } else {
                return '1/1'
            }
        })(),
    };

    return (
        <div className="bg-white relative overflow-hidden border-2 border-neutral-400" style={span}>
            <div className="absolute inset-2 inset-y-0 bottom-[20%] top-2"
                onMouseOver={() => setIsHovered(true)}
                onMouseOut={() => setIsHovered(false)}
            >
                <img className={`object-cover object-left w-full h-full absolute border-2 border-neutral-400 transition-all ${isHovered ? 'blur-sm' : ''}`} src={img} />
                <div className={`popup w-full h-full absolute flex p-20 items-center justify-center text-center transition-all text-black text-sm font-normal font-['Epilogue'] leading-[0.85rem] ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                {popup}
                </div>
            </div>
            <div className="top-[80%] absolute left-2">
                <div className="grid-title">{title}</div>
                <div className="grid-year">{year}</div>
            </div>
        </div>
    );
}

export default GridComponent;