"use client";

import { useEffect, useState } from 'react'
import Image from "next/image"

const ScrollComponent = () => {
    const [isOnTop, setIsOnTop] = useState(true);
    useEffect(() => {
        const handleScroll = () => {
            setIsOnTop(window.scrollY === 0);
        };
        
        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => window.removeEventListener('scroll', handleScroll);
    }, [])
    if (isOnTop) return null;

    return (
        <button
            type="button"
            className="scroll-to-top"
            aria-label="Scroll to top"
            onClick={() => window.scrollTo({
                top: 0,
                behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
            })}
        >
            <span className="scroll-to-top-icon" aria-hidden="true">
                <Image className="scroll-to-top-left" src="/design/scroll-top-left.svg" alt="" width={9.00048} height={9.00048} />
                <Image className="scroll-to-top-right" src="/design/scroll-top-right.svg" alt="" width={10.5003} height={8.50031} />
                <Image className="scroll-to-top-stem" src="/design/scroll-top-stem.svg" alt="" width={2.56606} height={19.0001} />
            </span>
        </button>   
    )
}

export default ScrollComponent
