'use client';

import { getProjectData } from "@/actions/actions";
import React, { useEffect, useRef, useState } from 'react';
import LoadingComponent from "./LoadingComponent";
import SomethingWentWrongComponent from "./SomethingWentWrongComponent";
import Link from "next/link";

interface GridComponentProps {
    projectKey: string;
    span: {
        row: number;
        col: number;
    };
}

export interface ProjectData {
    name: string;
    desc: string;
    image: string;
    year: string;
    id: string;
    [key: string]: unknown;
}

interface ComponentProperties {
    row: number;
    col: number;
}
  
function generateComponentProperties(k: number): ComponentProperties[] {
const result: ComponentProperties[] = [];
for (let i = 1; i <= k; i++) {
    let currentRow = 1;
    let currentCol = 1;
    const breakpoint = k - k % 4;
    if (i <= breakpoint) {
    switch (i % 4) {
        case 3:
        currentRow = 2;
        break;
        case 0:
        currentCol = 2;
        break;
        default:
        break;
    }
    } else {
    if (k % 4 === 1) {
        result[result.length - 1].col = 1;
    }
    }
    result.push({ row: currentRow, col: currentCol });
}
return result;
}

const GridComponent: React.FC<GridComponentProps> = ({ projectKey, span }) => {
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
        return <></>;
    }
    return (
        <article className={`bg-white relative overflow-hidden border-2 border-neutral-400 ${span.row === 2 ? 'grid-long' : span.col === 2 ? 'grid-wide' : 'aspect-square'}`}>
            <Link href={`/projects/${data.id}`} rel="noopener noreferrer">
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
            </Link>
        </article>
    );
}

const GridComponents = ({ keys, max }: { keys: string[], max: number }) => {
    let spanMap = generateComponentProperties(keys.length);

    const [isRenderingComplete, setIsRenderingComplete] = useState(false);

    useEffect(() => {
        setIsRenderingComplete(true);
    }, []);
    
    const renderGrid = keys.slice(0, max - 1).map((key, index) => {
        return (
            <GridComponent
            key={index}
            projectKey={key}
            span={spanMap[index]}
            />
        )
    })

    return (
        isRenderingComplete ? (
            <section className="work-display w-[85%] h-fit min-h-[70vh] left-[7.5%] relative justify-center mt-28 grid grid-cols-1 lg:grid-cols-3 grid-flow-row gap-y-6 gap-x-0 lg:gap-x-6 xl:gap-8 2xl:gap-10">
                {renderGrid}
            </section>
        ) : <LoadingComponent/>
    )
}


export default GridComponents;