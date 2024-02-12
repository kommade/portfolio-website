'use client';

import { getProjectThumbnail } from "@/functions/actions";
import React, { useCallback, useEffect, useState } from 'react';
import LoadingComponent from "./LoadingComponent";
import Link from "next/link";
import { DeleteWarningComponent, MessageDisplayComponent, PopUpComponent, usePopUp } from ".";
import { useRouter } from "next/navigation";

export interface ProjectThumbnailData {
    name: string;
    desc: string;
    image: string;
    year: string;
    id: string;
    [key: string]: unknown;
}

interface Pos {
    row: number;
    col: number;
}
  
function generateComponentProperties(k: number): Pos[] {
    const result: Pos[] = [];
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

const GridComponents = ({ keys, max, showTitle = true, editMode = false }: { keys: string[], max: number, showTitle?: boolean, editMode?: boolean }) => {
    let spanMap = generateComponentProperties(keys.length);
    const [isLoading, setIsLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [deleteProjectItem, setDeleteProjectItem] = useState({} as { id: string, name: string });
    const router = useRouter();
    const [popUp, setPopUp] = usePopUp();
    const [data, setData] = useState<ProjectThumbnailData[]>([]);
    const [error, setError] = useState(false);
    useEffect(() => {
        const fetchData = async () => {
            let allData = [];
            for (const key of keys) {
                const res = await getProjectThumbnail(key);
                if (!res.success) {
                    setError(true);
                }
                allData.push(res.data as ProjectThumbnailData)
            }
            setData(allData)
            setIsLoading(false);
        };
        fetchData();
    }, [keys]);
    if (max === 0) {
        max = keys.length + 1;
    }
    const GridComponent = ({ projectKey, data, span, editMode }: { projectKey: string, data: ProjectThumbnailData, span: Pos, editMode: boolean }) => {
        const [isHovered, setIsHovered] = useState(false);
        // useEffect(() => {
        //     const fetchData = async () => {
        //         if (!projectKey) {
        //             return;
        //         }
        //         const res = await getProjectThumbnail(projectKey);
        //         if (!res.success) {
        //             return;
        //         }
        //         setData(res.data as ProjectThumbnailData | null);
        //     };
        //     fetchData();
        // }, [projectKey]);
        if (data === null) {
            return <></>;
        }
        return (
            <Link
                href={`/projects/${data.id}`}
                rel="noopener noreferrer"
                className={`bg-white relative overflow-hidden shadow ${span.row === 2 ? 'grid-long' : span.col === 2 ? 'grid-wide' : 'aspect-square'} ${editMode ? " cursor-default" : ""}`}
                onClick={(e) => {
                    if (editMode) {
                        e.preventDefault();
                    }
                }}
            >   
                {
                    editMode ? (
                        <svg
                            className={`absolute right-2 top-2 cursor-pointer z-[999]`}
                            data-key={`${projectKey}-del-icon`}
                            x="0px"
                            y="0px"
                            width="32"
                            height="32"
                            viewBox="0,0,256,256"
                            onClick={(e) => {
                                const projectKey = e.currentTarget.getAttribute("data-key")!.replace("-del-icon", "")
                                setDeleteProjectItem({ id: projectKey, name: data.name });
                                setDialogOpen(true);
                            }}
                        >
                            <g fill="#de0000" fillRule="nonzero" stroke="none" strokeWidth="1" strokeLinecap="butt" strokeLinejoin="miter" strokeMiterlimit="10" strokeDasharray="" strokeDashoffset="0" fontFamily="none" fontWeight="none" fontSize="none" textAnchor="none" style={{ mixBlendMode: "normal" }}><g transform="scale(8.53333,8.53333)"><path d="M14.98438,2.48633c-0.55152,0.00862 -0.99193,0.46214 -0.98437,1.01367v0.5h-5.5c-0.26757,-0.00363 -0.52543,0.10012 -0.71593,0.28805c-0.1905,0.18793 -0.29774,0.44436 -0.29774,0.71195h-1.48633c-0.36064,-0.0051 -0.69608,0.18438 -0.87789,0.49587c-0.18181,0.3115 -0.18181,0.69676 0,1.00825c0.18181,0.3115 0.51725,0.50097 0.87789,0.49587h18c0.36064,0.0051 0.69608,-0.18438 0.87789,-0.49587c0.18181,-0.3115 0.18181,-0.69676 0,-1.00825c-0.18181,-0.3115 -0.51725,-0.50097 -0.87789,-0.49587h-1.48633c0,-0.26759 -0.10724,-0.52403 -0.29774,-0.71195c-0.1905,-0.18793 -0.44836,-0.29168 -0.71593,-0.28805h-5.5v-0.5c0.0037,-0.2703 -0.10218,-0.53059 -0.29351,-0.72155c-0.19133,-0.19097 -0.45182,-0.29634 -0.72212,-0.29212zM6,9l1.79297,15.23438c0.118,1.007 0.97037,1.76563 1.98438,1.76563h10.44531c1.014,0 1.86538,-0.75862 1.98438,-1.76562l1.79297,-15.23437z"></path></g></g>
                        </svg>
                    ) : <></>
                }
                <section className='absolute inset-[15px] bottom-[25%]'
                    onMouseOver={() => setIsHovered(true)}
                    onMouseOut={() => setIsHovered(false)}
                >
                    <img className={`editable object-cover object-left w-full h-full absolute transition-all ${isHovered || editMode ? ' blur-[2px]' : ''}`} src={data.image} alt={`${data.name} image`} />
                    <p className={`editable popup w-full h-full absolute flex p-20 items-center justify-center text-center transition-all text-black xs-regular ${isHovered || editMode ? 'opacity-100' : 'opacity-0'}`}>
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

    const renderGrid = useCallback((editMode: boolean, data: ProjectThumbnailData[], spanMap: Pos[]) => data.slice(0, max - 1).map((d, index) =>
        <GridComponent
                key={`project:${index}`}
                data={d}
                projectKey={keys[index]}
                span={spanMap[index]}
                editMode={editMode}
            />
        ), [editMode, keys, spanMap, max])

    const handleCallback = (message: string) => {
        setDialogOpen(false);
        if (message === "success") {
            setPopUp({ message: "Project deleted successfully", type: "success", duration: 1000 });
            setTimeout(() => {
                router.refresh();
            }, 1000);
        } else if (message === "error") {
            setPopUp({ message: "Error deleting project", type: "warning", duration: 1000 });
        }
    }
    const grid = renderGrid(editMode, data, spanMap);

    if (error) {
        return (
            <MessageDisplayComponent text="Whoops! Something went wrong. "/>
        );
    }

    return (
        !isLoading ? (
            <>
                {dialogOpen ? <DeleteWarningComponent item={deleteProjectItem} callback={handleCallback}/> : <></> }
                {showTitle ?
                    <h2 className="w-full h-[34px] mt-[80px] lg:mt-[110px] text-center">I’m a dreamer and a UX designer, currently based in Singapore. Here’s some of my work:</h2>
                    : <div className="h-0 mt-[40px] lg:mt-[70px]"></div>
                }
                <section className={`work-display w-[85%] h-fit min-h-[calc(100vh_-_108px)] lg:min-h-[calc(100vh_-_138px)] left-[7.5%] relative justify-center mt-[30px] grid grid-cols-1 lg:grid-cols-3 grid-flow-row gap-y-6 gap-x-0 lg:gap-x-6 ${showTitle ? "" : "mb-[40px]"}`}>
                    {grid}
                </section>
                <PopUpComponent popUpProps={popUp}/>
            </>
        ) : <LoadingComponent/>
    )
}


export default GridComponents;