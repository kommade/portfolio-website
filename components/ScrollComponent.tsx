"use client";

import React, { useEffect, useState } from 'react'
import Image from "next/image"

const ScrollComponent = () => {
    const [isHovered, setHovered] = useState(false);
    const [isOnTop, setIsOnTop] = useState(true);
    useEffect(() => {
        const handleScroll = () => {
            setIsOnTop(window.scrollY === 0);
        };
        
        window.addEventListener('scroll', handleScroll);

        return () => window.removeEventListener('scroll', handleScroll);
    }, [])
    return (
        <button
            className="bottom-8 right-2 w-20 h-[120px] fixed z-[1000]"
            onClick={() => window.scrollTo({
                top: 0,
                behavior: 'smooth',
            })}
        >
            <div
                className={`transition-opacity ${isOnTop ? 'opacity-0 cursor-default' : 'opacity-70'} w-[60px] h-[100px] left-0 top-0 absolute bg-white bg-opacity-70 rounded-[15px] border border-neutral-400 flex justify-center`}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            >
                <Image
                    className={`self-center transition-transform transform-gpu ${isHovered ? 'animate-wiggle' : ''}`}
                    src="/icons/scroll-up-icon.png"
                    alt="scroll-up-icon"
                    width={30}
                    height={0}
                />
            </div>
        </button>   
    )
}

export default ScrollComponent