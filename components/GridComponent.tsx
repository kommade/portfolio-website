'use client';

import { getProjectData } from "@/actions/actions";
import React, { useEffect, useState } from 'react';

interface GridComponentProps {
    projectKey: string;
    span: {
        row: number;
        col: number;
    };
}
interface ProjectData {
    name: string;
    desc: string;
    image: string;
    year: string;
    id: string;
    [key: string]: unknown;
 }

const GridComponent: React.FC<GridComponentProps> = ({ projectKey , span }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [data, setData] = useState<ProjectData | null>(null);
    useEffect(() => {
        const fetchData = async () => {
            if (!projectKey) {
                return;
            }
            let stored;
            if (typeof localStorage !== 'undefined') {
                stored = localStorage.getItem(projectKey);
            }
            if (!stored) {
                const res = await getProjectData(projectKey);
                if (!res.success) {
                    return;
                }
                if (typeof localStorage !== 'undefined') {
                    localStorage.setItem('myData', JSON.stringify(data));
                }
                setData(res.data as ProjectData | null);
            } else {
                const data = JSON.parse(stored)
                setData(data);
            }
            
        };
 
        fetchData();
    }, [projectKey]);
    if (data === null) {
        return (
            <div>
                Loading...
            </div>
        )
    }
    return (
        <article className={`bg-white relative overflow-hidden border-2 border-neutral-400 ${span.row === 2 ? 'grid-long' : span.col === 2 ? 'grid-wide' : 'aspect-square'}`}>
            <a href={`/projects/${data.id}`} rel="noopener noreferrer">
                <section className='absolute inset-2 inset-y-0 border-2 border-neutral-400 top-2 bottom-[20%]'
                    onMouseOver={() => setIsHovered(true)}
                    onMouseOut={() => setIsHovered(false)}
                >
                    <img className={`object-cover object-left w-full h-full absolute transition-all ${isHovered ? ' blur-[2px]' : ''}`} src={data.image} alt={`${data.name} image`} />
                    <p className={`popup w-full h-full absolute flex p-20 items-center justify-center text-center transition-all text-black text-sm font-normal font-['Epilogue'] leading-[0.85rem] ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                    {data.desc}
                    </p>
                </section>
                <section className="top-[80%] absolute left-2">
                    <h1 className="grid-title">{data.name}</h1>
                    <h2 className="grid-year">{data.year}</h2>
                </section>
            </a>
        </article>
    );
}

export default GridComponent;