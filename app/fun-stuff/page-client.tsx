"use client";

import { HeaderComponent, FooterComponent, DeleteWarningComponent, PopUpComponent, usePopUp } from "@/components";
import { logout, updateFunStuffName } from "@/functions/actions";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from 'react';
import Image from "next/image";

export interface FunStuffData {
    sketchbook: ({ id:string, name: string, url: string } | null)[];
    photography: ({ id:string, name: string, url: string } | null)[];
    craft: ({ id:string, name: string, url: string } | null)[]
}

export const FunStuff = ({ data, access }: { data: FunStuffData, access: string}) => {
    const [n, setN] = useState(data["sketchbook"].length);
    const [percentage, setPercentage] = useState(-108); // Disclaimer: none of these are percentages
    const [prevPercentage, setPrevPercentage] = useState(-108);
    const [mousePos, setMousePos] = useState(0);
    const imageHolder = useRef(null);
    const numberDisplay = useRef(null);
    const [transition, setTransition] = useState(false);
    const [currentFullScreen, setCurrentFullScreen] = useState(-1);
    const [category, setCategory] = useState<"sketchbook" | "photography" | "craft">("sketchbook")
    const searchParams = useSearchParams();
    const editMode = searchParams.get("edit") === "true";
    const [dialogOpen, setDialogOpen] = useState(false);
    const [deleteImageId, setDeleteImageId] = useState(-1);
    const [popUp, setPopUp] = usePopUp();
    const router = useRouter();
    const dropdownRef = useRef(null);
    const parentDropdownRef = useRef(null);
    const [dropdown, setDropdown] = useState(false);
    const descRef = useRef(null);
    const [descText, setDescText] = useState("");
    const [descEdit, setDescEdit] = useState(false);

    if (access === "expired") {
        logout();
        router.push("/?expired=true");
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !(dropdownRef.current as any).contains(event.target) && !(parentDropdownRef.current as any).contains(event.target)) {
                setDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    const handleMouseDown = (e: React.MouseEvent) => {
        if (currentFullScreen > -1) {
            return;
        }
        e.preventDefault();
        setMousePos(e.clientX);
    }

    const handleTouchStart = (e: React.TouchEvent) => {
        if (currentFullScreen > -1) {
            return;
        }
        setMousePos(e.touches[0].clientX);
    }

    const handleMouseUp = (e: React.MouseEvent) => {
        if (currentFullScreen > -1) {
            return;
        }
        e.preventDefault();
        setMousePos(0);
        setPrevPercentage(percentage);
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (currentFullScreen > -1) {
            return;
        }
        e.preventDefault();
        setMousePos(0);
        setPrevPercentage(percentage);
    }

    const handleMouseMove = (e: React.MouseEvent) => {
        if (currentFullScreen > -1) {
            return;
        }
        e.preventDefault();
        if (mousePos === 0) {
            return;
        }
        const mouseDelta = mousePos - e.clientX;
        const maxDelta = window.innerWidth / 2;
        const calcPercentage = (mouseDelta / maxDelta) * -100;
        const nextPercentage = Math.max(Math.min(prevPercentage + calcPercentage, -20), (n - 1) * - 44 - 20);
        setPercentage(nextPercentage);
        updatePosition();
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (currentFullScreen > -1) {
            return;
        }
        if (mousePos === 0) {
            return;
        }
        const mouseDelta = mousePos - e.touches[0].clientX;
        const maxDelta = window.innerWidth / 2;
        const calcPercentage = (mouseDelta / maxDelta) * -100 / 2;
        const nextPercentage = Math.max(Math.min(prevPercentage + calcPercentage, -20), (n - 1) * - 44 - 20);
        setPercentage(nextPercentage);
        updatePosition();
    };

    const handleWheel = (e: React.WheelEvent) => {
        if (currentFullScreen > -1) {
            return;
        }
        let scrollDirection = 0;
        if (e.deltaY !== 0) {
            scrollDirection = e.deltaY > 0 ? -1 : 1;
        } else if (e.deltaX !== 0) {
            scrollDirection = e.deltaX > 0 ? -1 : 1;
        }
        let scrollAmount = 1;
        if (Math.abs((e.nativeEvent as any).wheelDelta) === 180) {
            scrollAmount = 16
        } else {
            scrollAmount = 4
        }
        const nextPercentage = Math.max(Math.min(prevPercentage + scrollDirection * scrollAmount, -20), (n - 1) * - 44 - 20);
        setPercentage(nextPercentage);
        setPrevPercentage(percentage);
        updatePosition();
    };

    const handleMouseClick = (e: React.MouseEvent) => {
        if (e.currentTarget.id === "cancel") {
            return;
        }
        let index = e.currentTarget.getAttribute('data-key');
        if (currentFullScreen !== -1) {
            setCurrentFullScreen(-1);
            setDescEdit(false);
            if (descRef.current) {
                (descRef.current as HTMLElement).contentEditable = "false"
            }
            return;
        } else if (index === null) {
            return;
        }
        const intIndex = parseInt(index)
        setCurrentFullScreen(intIndex);
        data![category][intIndex]?.name && setDescText(data![category][intIndex]!.name)
        const calcPercentage = intIndex * - 44 - 20;
        setPercentage(calcPercentage);
        setPrevPercentage(calcPercentage);
        updatePosition(500, calcPercentage);
    }

    const updatePosition = (duration: number = 1200, movement: number = percentage) => {
        if (imageHolder.current) {
            console.log(window.innerWidth)
            if (window.innerWidth <= 1024) {
                if (imageHolder.current) {
                    (imageHolder.current as HTMLElement).animate({
                        transform: `translate(${movement}vmin, -50%`
                    }, { duration: duration, fill: "forwards" });
                }
            } else {
    
                if (imageHolder.current) {
                    (imageHolder.current as HTMLElement).animate({
                        transform: `translate(${movement}vmin, calc(87px + 4vh))`
                    }, { duration: duration, fill: "forwards" });
                }
            }
        }
        if (numberDisplay.current) {
            (numberDisplay.current as HTMLElement).animate({
                transform: `translate(0, ${((movement + 20)/ ((n - 1) * 44)) * (n - 1) * 14}px)`
            }, { duration: duration, fill: "forwards" });
        }
        // scary vanilla javascript in a react dom !!!
        Array.from(document.getElementsByClassName("image")).forEach(element => {
            element.animate({
                objectPosition: `${(movement + 20) * 100 / ((n - 1) * 44) + 100}% 50%`
            }, { duration: duration, fill: "forwards" });
        });
    }

    const categoryClicked = (newCategory: "sketchbook" | "photography" | "craft") => {
        if (newCategory === category) {
            return;
        }
        setN(data![newCategory].length)
        setPercentage(-108)
        setPrevPercentage(-108)
        updatePosition(800, -108)
        setTransition(true)
        setTimeout(() => {
            setCategory(newCategory)
            setTransition(false)
        }, 300)
        
    }

    return (
        <main className="flex flex-col items-center justify-between overflow-x-clip">
            <div className="w-screen h-[100vh] relative flex flex-col">
                <HeaderComponent/>
                <section
                    className="w-full min-h-[calc(100vh_-_108px)] lg:min-h-[calc(100vh_-_138px)] relative justify-start items-start mt-[40px] lg:mt-[70px] inline-flex flex-row"
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    onMouseMove={handleMouseMove}
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                    onTouchMove={handleTouchMove}
                    onWheel={handleWheel}
                    onClick={handleMouseClick}
                >
                    <div
                        ref={parentDropdownRef}
                        className={`w-[100px] h-[42px] pl-4 mt-2 ml-2 rounded-lg text-start flex justify-between items-center z-[2]  ${!dropdown ? "" : "hidden"}`}
                        onClick={() => setDropdown(true)}>
                        <div className="h-[24px] flex justify-center items-center">
                            <p className="s-regular select-none h-fit">{category.charAt(0).toUpperCase() + category.slice(1)}</p>
                        </div>
                        <Image
                            className="-translate-y-[6.25%]"
                            src="/icons/dropdown.svg"
                            alt="v"
                            width={24}
                            height={24}
                            draggable={false}
                        />
                    </div>
                    <div ref={dropdownRef} className={`absolute w-[150px] h-[126px] bg-pale-butter rounded-lg rounded-t-none p-4 z-[1] opacity-90 shadow-xl ${dropdown ? "" : "hidden"}`}>
                        <div
                            className="s-regular w-full flex justify-start items-center gap-2 py-2 pl-2 rounded-lg hover:bg-white hover:cursor-pointer"
                            onClick={() => {
                                categoryClicked("sketchbook")
                                setDropdown(false)
                            }}>
                            Sketchbook
                        </div>
                        <div
                            className="s-regular w-full flex justify-start items-center gap-2 py-2 pl-2 rounded-lg hover:bg-white hover:cursor-pointer"
                            onClick={() => {
                                categoryClicked("photography")
                                setDropdown(false)
                            }}>
                            Photography
                        </div>
                        <div
                            className="s-regular w-full flex justify-start items-center gap-2 py-2 pl-2 rounded-lg hover:bg-white hover:cursor-pointer"
                            onClick={() => {
                                categoryClicked("craft")
                                setDropdown(false)
                            }}>
                            Craft
                        </div>
                    </div>
                    <div className={`w-fit h-[14px] absolute px-2 left-1/2 -translate-x-1/2 translate-y-[calc((87px_+_4vh)_/_2_-100%)] text-center flex transition-opacity duration-300 ease-in-out ${currentFullScreen > -1 ? "opacity-0" : ""}`}>
                        <h4 className="overflow-hidden">
                            <div className={`-translate-y-[28px]`} ref={numberDisplay}>
                                {Array.from({ length: n }, (_, i) => i + 1).map((num, i) => (
                                    <React.Fragment key={`${i}-ticker`}>
                                        {num.toString()}&nbsp;
                                        {num !== n ? <br/> : <></>}
                                    </React.Fragment>
                                ))}
                            </div>
                        </h4>
                        <h4>- {n}</h4>
                    </div>
                    <div className={`z-[100] w-fit h-[20px] fixed px-2 bottom-[40vmin] lg:bottom-[15vmin] left-1/2 -translate-x-1/2 text-center flex transition-opacity duration-300 ease-in-out opacity-0 ${currentFullScreen > -1 ? "opacity-100 delay-500" : ""}`}>
                        <p
                            ref={descRef}
                            className="h-[1px] w-fit mt-[10px] min-w-[100px] s-regular z-[100]"
                            onClick={(e) => {
                                e.stopPropagation();
                            }}
                            onKeyDown={async (e) => {
                                if (e.key === "Enter" && descRef.current && descEdit) {
                                    e.preventDefault();
                                    (descRef.current as HTMLElement).contentEditable = "false"
                                    setDescEdit(false);
                                    const res = await updateFunStuffName(data![category][currentFullScreen]!.id, (descRef.current as HTMLElement).innerText)
                                    if (res.success) {
                                        setPopUp({ message: "Update successful!", type: "success", duration: 1000 })
                                    } else {
                                        setPopUp({ message: "Update failed!", type: "warning", duration: 1000 })
                                    }
                                } else if (e.key === "Escape" && descRef.current && descEdit) {
                                    e.preventDefault();
                                    (descRef.current as HTMLElement).contentEditable = "false"
                                    setDescEdit(false);
                                }
                            }}
                        >
                            {descText}
                        </p>
                        {
                            editMode ? (
                                <svg
                                    className="h-[10px] mt-[12px] cursor-pointer"
                                    x="0px"
                                    y="0px"
                                    width="10"
                                    height="10"
                                    viewBox="0 0 50 50"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (descRef.current) { 
                                            (descRef.current as HTMLElement).contentEditable = "true"
                                        }
                                        setDescEdit(true);
                                        setPopUp({ message: "Click on the description to edit and press enter to save", type: "message", duration: 1000 })
                                    }}
                                >
                                    <path d="M 43.125 2 C 41.878906 2 40.636719 2.488281 39.6875 3.4375 L 38.875 4.25 L 45.75 11.125 C 45.746094 11.128906 46.5625 10.3125 46.5625 10.3125 C 48.464844 8.410156 48.460938 5.335938 46.5625 3.4375 C 45.609375 2.488281 44.371094 2 43.125 2 Z M 37.34375 6.03125 C 37.117188 6.0625 36.90625 6.175781 36.75 6.34375 L 4.3125 38.8125 C 4.183594 38.929688 4.085938 39.082031 4.03125 39.25 L 2.03125 46.75 C 1.941406 47.09375 2.042969 47.457031 2.292969 47.707031 C 2.542969 47.957031 2.90625 48.058594 3.25 47.96875 L 10.75 45.96875 C 10.917969 45.914063 11.070313 45.816406 11.1875 45.6875 L 43.65625 13.25 C 44.054688 12.863281 44.058594 12.226563 43.671875 11.828125 C 43.285156 11.429688 42.648438 11.425781 42.25 11.8125 L 9.96875 44.09375 L 5.90625 40.03125 L 38.1875 7.75 C 38.488281 7.460938 38.578125 7.011719 38.410156 6.628906 C 38.242188 6.246094 37.855469 6.007813 37.4375 6.03125 C 37.40625 6.03125 37.375 6.03125 37.34375 6.03125 Z"/>
                                </svg>
                            ) : <></>
                        }
                    </div>
                    <article ref={imageHolder} className={`w-fit flex gap-[4vmin] absolute left-1/2 top-1/2 lg:top-0 transform -translate-x-[108vmin] -translate-y-1/2 lg:translate-y-[calc(87px_+_4vh)] select-none transition-opacity duration-300 ease-in-out ${transition ? 'opacity-0': ''}`}>
                        {
                            data![category].map((image, index) => (
                                <div key={`${image!.name}-div`} className={`relative transition-all duration-[800ms] ease-in-out ${currentFullScreen === index ? "w-[100vmin] h-[66.66vmin] lg:-translate-y-[87px] opacity-100 min-w-[40vmin] " : "w-[40vmin] min-w-[40vmin] h-[56vmin] -translate-x-0 " + (currentFullScreen > -1 ? "opacity-0" : "")}`}>
                                    <Image
                                        key={image!.name}
                                        data-key={index}
                                        className={`image transition-all duration-[800ms] ease-in-out object-cover ${currentFullScreen === index ? "h-[66.66vmin] -translate-x-[calc((100%_-_40vmin)_/_2)]" : "h-[56vmin]" }`}
                                        style={{objectPosition: `${-88 * 100 / ((n - 1) * 44) + 100}% 50%`}}
                                        onClick={handleMouseClick}
                                        src={image!.url}
                                        alt={image!.name}
                                        fill
                                        priority={index <= 5}
                                        sizes="100vmin"
                                        draggable={false}
                                        onContextMenu={(e) => e.preventDefault()}
                                    />
                                    {
                                        editMode ? (
                                            <svg
                                                className={`absolute right-2 top-2 bg-[rgba(255,255,255,0.3)] cursor-pointer rounded-lg transition-opacity ${currentFullScreen > -1 ? 'opacity-0 ' : 'delay-[800ms]'}`}
                                                key={`${index}-del-icon`}
                                                data-key={`${index}-del-icon`}
                                                x="0px"
                                                y="0px"
                                                width="32"
                                                height="32"
                                                viewBox="0,0,256,256"
                                                onClick={(e) => {
                                                    const name = e.currentTarget.getAttribute("data-key")!.replace("-del-icon", "")
                                                    setDeleteImageId(parseInt(name))
                                                    setDialogOpen(true)
                                                }}
                                            >
                                                <g fill="#de0000" fillRule="nonzero" stroke="none" strokeWidth="1" strokeLinecap="butt" strokeLinejoin="miter" strokeMiterlimit="10" strokeDasharray="" strokeDashoffset="0" fontFamily="none" fontWeight="none" fontSize="none" textAnchor="none" style={{ mixBlendMode: "normal" }}><g transform="scale(8.53333,8.53333)"><path d="M14.98438,2.48633c-0.55152,0.00862 -0.99193,0.46214 -0.98437,1.01367v0.5h-5.5c-0.26757,-0.00363 -0.52543,0.10012 -0.71593,0.28805c-0.1905,0.18793 -0.29774,0.44436 -0.29774,0.71195h-1.48633c-0.36064,-0.0051 -0.69608,0.18438 -0.87789,0.49587c-0.18181,0.3115 -0.18181,0.69676 0,1.00825c0.18181,0.3115 0.51725,0.50097 0.87789,0.49587h18c0.36064,0.0051 0.69608,-0.18438 0.87789,-0.49587c0.18181,-0.3115 0.18181,-0.69676 0,-1.00825c-0.18181,-0.3115 -0.51725,-0.50097 -0.87789,-0.49587h-1.48633c0,-0.26759 -0.10724,-0.52403 -0.29774,-0.71195c-0.1905,-0.18793 -0.44836,-0.29168 -0.71593,-0.28805h-5.5v-0.5c0.0037,-0.2703 -0.10218,-0.53059 -0.29351,-0.72155c-0.19133,-0.19097 -0.45182,-0.29634 -0.72212,-0.29212zM6,9l1.79297,15.23438c0.118,1.007 0.97037,1.76563 1.98438,1.76563h10.44531c1.014,0 1.86538,-0.75862 1.98438,-1.76562l1.79297,-15.23437z"></path></g></g>
                                            </svg>
                                        ) : <></>
                                    }
                                </div>
                            ))
                        }
                    </article>
                </section>
                {
                    dialogOpen ? <DeleteWarningComponent item={{ id: data![category][deleteImageId]!.id, name: data![category][deleteImageId]!.name }} callback={(message) => {
                        setDialogOpen(false)
                        setDeleteImageId(-1)
                        switch (message) {
                            case 'success':
                                setPopUp({ message: 'Delete successful!', type: "success", duration: 1000 })
                                setTimeout(() => router.refresh(), 1000)
                                break;
                            case 'error':
                                setPopUp({ message: 'Something went wrong', type: "warning", duration: 1000 })
                                break;
                            default:
                                break;
                        }
                    }} /> : <></>
                }
                <PopUpComponent popUpProps={popUp}/>
                <FooterComponent/>
            </div>
        </main>
    )
}