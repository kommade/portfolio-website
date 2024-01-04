'use client';

import React, { useState } from 'react';

interface GridComponentProps {
    popup: string;
    title: string;
    year: string;
    img?: string;
    row?: number;
    col?: number;
}

const GridComponent: React.FC<GridComponentProps> = ({ popup, title, year, img = "https://via.placeholder.com/510x412", row = 1, col = 1 }) => {
    const [isHovered, setIsHovered] = useState(false);
    return (
        <article className={`bg-white relative overflow-hidden border-2 border-neutral-400 ${row === 2 ? 'grid-long' : col === 2 ? 'grid-wide' : 'aspect-square'}`}>
            <section className='absolute inset-2 inset-y-0 border-2 border-neutral-400 top-2 bottom-[20%]'
                onMouseOver={() => setIsHovered(true)}
                onMouseOut={() => setIsHovered(false)}
            >
                <img className={`object-cover object-left w-full h-full absolute transition-all ${isHovered ? ' blur-[2px]' : ''}`} src={img} alt={`${title} image`} />
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