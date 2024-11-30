import Image from "next/image"
import React from 'react'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./ui/carousel"
import { XIcon } from "lucide-react"

const FullScreenImageComponent =
    ({ images, index, close }:
        {
            images: string[],
            index: number,
            close: () => void
        }
    ) => {
        const [clicked, setClicked] = React.useState(false);
        const [timeoutId, setTimeoutId] = React.useState<NodeJS.Timeout | null>(null);
        const updateNumberDisplay = () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
    
            setClicked(false);
            const id = setTimeout(() => { // Yeah I don't even know
                setClicked(true);
                setTimeoutId(setTimeout(() => {
                    setClicked(false);
                }, 1500));
            }, 500);
            setTimeoutId(id);
        }
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                close();
            }
        }
        window.addEventListener("keydown", handleKeyDown);
        return (
            <Carousel
                opts={{
                    startIndex: index,
                    align: "center",
                    loop: true,
                }}

                className="fixed top-0 left-0 w-full h-full bg-warm-grey/90 z-2025 flex justify-center items-center"
            >
                <CarouselContent className="w-[90vw] h-[90vh]">
                    {
                        images.map((image, i) => (
                            <CarouselItem key={i} className="relative">
                                <div className="relative w-full h-full">
                                    <Image loading={(i < 5 || i - 5 > images.length) ? "eager" : "lazy"} className="object-scale-down" src={image} alt={`img-${i}`} fill sizes="90vw" onContextMenu={(e) => e.preventDefault()}/>
                                    <div className={`w-fit h-[18px] absolute bottom-[30px] left-1/2 -translate-x-1/2 flex items-center transition-opacity duration-300 ease-in-out ${clicked ? " opacity-100" : "opacity-0"}`}>
                                        <h4 className="z-2026 bg-pale-butter/50 rounded-full py-1 px-3">{i + 1} of {images.length}</h4>
                                    </div>
                                </div>
                            </CarouselItem>
                        ))
                    }
                </CarouselContent>
                <CarouselNext scrollFunction={updateNumberDisplay} className={`absolute top-1/2 right-8 transform -translate-y-1/2 border-0 dark:bg-transparent dark:hover:bg-transparent dark:hover:text-eggplant-purple dark:text-eggplant-purple`}/>
                <CarouselPrevious scrollFunction={updateNumberDisplay} className="absolute top-1/2 left-8 transform -translate-y-1/2 border-0 dark:bg-transparent dark:hover:bg-transparent dark:hover:text-eggplant-purple dark:text-eggplant-purple"/>
                <button className="absolute top-8 right-8 rounded-full" onClick={close}><XIcon className="stroke-black"/></button>
            </Carousel>
        )
}

export default FullScreenImageComponent