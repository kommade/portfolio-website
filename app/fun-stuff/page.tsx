"use client";

import { getAllCategoryData, getFunStuff, getFunStuffData } from "@/actions/actions";
import FooterComponent from "@/components/FooterComponent";
import HeaderComponent from "@/components/HeaderComponent";
import LoadingComponent from "@/components/LoadingComponent";
import SomethingWentWrongComponent from "@/components/SomethingWentWrongComponent";
import React, { useEffect, useRef, useState } from 'react';

interface FunStuffData {
    sketchbook: ({ name: string, url: string } | null)[];
    photography: ({ name: string, url: string } | null)[];
    craft: ({ name: string, url: string } | null)[]
}

const FunStuff = () => {
    const [n, setN] = useState(0);
    const [data, setData] = useState<FunStuffData | null>(null);
    const [error, setError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [percentage, setPercentage] = useState(-108);
    const [prevPercentage, setPrevPercentage] = useState(-108);
    const [mousePos, setMousePos] = useState(0);
    const imageHolder = useRef(null);
    const numberDisplay = useRef(null);
    const [transition, setTransition] = useState(false);
    const [currentFullScreen, setCurrentFullScreen] = useState(-1);
    const [category, setCategory] = useState<"sketchbook" | "photography" | "craft">("sketchbook")
    useEffect(() => {
        const fetchData = async () => {
            const res = await getFunStuff();
            if (!res.success) {
                setError(true)
                return;
            }
            setData(res.data)
            setN(res.data.sketchbook.length);
            setIsLoading(false);
        };
        fetchData();
    }, []);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (currentFullScreen > -1) {
            return;
        }
        e.preventDefault();
        setMousePos(e.clientX);
    }

    const handleMouseUp = (e: React.MouseEvent) => {
        if (currentFullScreen > -1) {
            return;
        }
        e.preventDefault();
        setMousePos(0);
        setPrevPercentage(percentage);
    };

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
            return;
        } else if (index === null) {
            return;
        }
        const intIndex = parseInt(index)
        setCurrentFullScreen(intIndex);
        const calcPercentage = intIndex * - 44 - 20;
        setPercentage(calcPercentage);
        setPrevPercentage(calcPercentage);
        updatePosition(500, calcPercentage);
        console.log(percentage)
    }

    const updatePosition = (duration: number = 1200, movement: number = percentage) => {
        if (imageHolder.current) {
            (imageHolder.current as HTMLElement).animate({
                transform: `translate(${movement}vmin, calc(87px + 4vh)`
            }, { duration: duration, fill: "forwards" });
        }
        if (numberDisplay.current) {
            console.log(((movement + 20) / ((n - 1) * 44)));
            (numberDisplay.current as HTMLElement).animate({
                transform: `translate(0, ${((movement + 20)/ ((n - 1) * 44)) * (n - 1) * 20}px)`
            }, { duration: duration, fill: "forwards" });
        }
        // scary vanilla javascript in a react dom !!!
        Array.from(document.getElementsByClassName("image")).forEach(element => {
            element.animate({
                objectPosition: `${(movement + 20) * 100 / ((n - 1) * 44) + 100}% 50%`
            }, { duration: duration, fill: "forwards" });
        });
    }

    if (error || (!isLoading && data === null)) {
        return (
            <main className="flex flex-col items-center justify-between overflow-x-clip">
                <div className="w-screen relative flex flex-col">
                    <HeaderComponent/>
                    <SomethingWentWrongComponent/>
                </div>
            </main>
        );
    } else if (isLoading) {
        return (
            <main className="flex flex-col items-center justify-between overflow-x-clip">
                <div className="w-screen relative flex flex-col">
                    <HeaderComponent/>
                    <LoadingComponent/>
                </div>
            </main>
        )
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
                    onWheel={handleWheel}
                    onClick={handleMouseClick}
                >
                    <nav id="cancel" className={`w-fit h-[87px] my-[2vh] ml-[1vmin] flex flex-col justify-between px-4 transition-opacity duration-300 ease-in-out cursor-pointer ${currentFullScreen > -1 ? "opacity-0" : ""}`}>
                        <h5
                            className={`fun-stuff-title ${category === "sketchbook" ? "text-blue-500" : ""}`}
                            onClick={() => categoryClicked("sketchbook")}>
                            Sketchbook
                        </h5>
                        <h5
                            className={`fun-stuff-title ${category === "photography" ? "text-blue-500" : ""}`}
                            onClick={() => categoryClicked("photography")}>
                            Photography
                        </h5>
                        <h5
                            className={`fun-stuff-title ${category === "craft" ? "text-blue-500" : ""}`}
                            onClick={() => categoryClicked("craft")}>
                            Craft
                        </h5>
                    </nav>
                    <div className="w-fit h-[20px] absolute px-2 left-1/2 -translate-x-1/2 translate-y-[calc((87px_+_4vh)_/_2_-100%)] text-center flex">
                        <h4 className="overflow-hidden">
                            <div className={`-translate-y-[40px]`} ref={numberDisplay}>
                                {Array.from({ length: n }, (_, i) => i + 1).map((num, i) => (
                                    <React.Fragment key={i}>
                                        {num.toString()}&nbsp;
                                        {num !== n ? <br/> : <></>}
                                    </React.Fragment>
                                ))}
                            </div>
                        </h4>
                        <h4>- {n}</h4>
                    </div>
                    <article ref={imageHolder} className={`w-full flex gap-[4vmin] absolute left-1/2 top-0 transform -translate-x-[108vmin] translate-y-[calc(87px_+_4vh)] select-none transition-opacity duration-300 ease-in-out ${transition ? 'opacity-0': ''}`}>
                        {
                            data![category].map((image, index) => (
                                <img
                                    key={image!.name}
                                    data-key={index}
                                    className={`image transition-all duration-[800ms] object-cover object-[100%_center] ${currentFullScreen === index ? "w-[100vmin] h-[66.66vmin] -translate-x-[calc((100%_-_40vmin)_/_2)] -translate-y-[calc(50%_-_(87px_+_4vh))] opacity-100 " : "w-[40vmin] h-[56vmin] -translate-x-0 " + (currentFullScreen > -1 ? "opacity-0" : "")}`}
                                    onClick={handleMouseClick}
                                    src={image!.url}
                                    draggable={false}
                                />
                            ))
                        }
                    </article>
                </section>
                <FooterComponent/>
            </div>
        </main>
    )
}

export default FunStuff