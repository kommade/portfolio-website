'use client';

import { getProjectThumbnail } from "@/functions/actions";
import React, { useEffect, useState } from 'react';
import LoadingComponent from "./LoadingComponent";
import Link from "next/link";

interface GridComponentProps {
    projectKey: string;
    span: {
        row: number;
        col: number;
    };
}

export interface ProjectThumbnailData {
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
    const [data, setData] = useState<ProjectThumbnailData | null>(null);
    useEffect(() => {
        const fetchData = async () => {
            if (!projectKey) {
                return;
            }
            const res = await getProjectThumbnail(projectKey);
            if (!res.success) {
                return;
            }
            setData(res.data as ProjectThumbnailData | null);
            
        };
        fetchData();
    }, [projectKey]);
    if (data === null) {
        return <></>;
    }
    return (
        <Link
            href={`/projects/${data.id}`}
            rel="noopener noreferrer"
            className={`bg-white relative overflow-hidden shadow ${span.row === 2 ? 'grid-long' : span.col === 2 ? 'grid-wide' : 'aspect-square'}`}
        >
            <section className='absolute inset-[15px] bottom-[25%]'
                onMouseOver={() => setIsHovered(true)}
                onMouseOut={() => setIsHovered(false)}
            >
                <img className={`object-cover object-left w-full h-full absolute transition-all ${isHovered ? ' blur-[2px]' : ''}`} src={data.image} alt={`${data.name} image`} />
                <p className={`popup w-full h-full absolute flex p-20 items-center justify-center text-center transition-all text-black xs-regular ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                {data.desc}
                </p>
            </section>
            <section className="top-[75%] translate-y-[5%] absolute left-4">
                <h3 className="text-warm-grey whitespace-nowrap pt-[8px]">{data.name}</h3>
                <h5 className="text-warm-grey">{data.year}</h5>
            </section>
        </Link>
    );
}

const GridComponents = ({ keys, max, showTitle = true }: { keys: string[], max: number, showTitle?: boolean }) => {
    let spanMap = generateComponentProperties(keys.length);
    const [isRenderingComplete, setIsRenderingComplete] = useState(false);
    useEffect(() => {
        setIsRenderingComplete(true);
    }, []);
    
    if (max === 0) {
        max = keys.length + 1;
    }

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
            <>
                { showTitle ?
                    <h2 className="w-full h-[34px] mt-[80px] lg:mt-[110px] text-center">I’m a dreamer and a UX designer, currently based in Singapore. Here’s some of my work:</h2>
                    : <div className="h-0 mt-[40px] lg:mt-[70px]"></div>
                }
                <section className={`work-display w-[85%] h-fit min-h-[calc(100vh_-_108px)] lg:min-h-[calc(100vh_-_138px)] left-[7.5%] relative justify-center mt-[30px] grid grid-cols-1 lg:grid-cols-3 grid-flow-row gap-y-6 gap-x-0 lg:gap-x-6 ${showTitle ? "" : "mb-[40px]"}`}>
                    {renderGrid}
                </section>
            </>
        ) : <LoadingComponent/>
    )
}


export default GridComponents;