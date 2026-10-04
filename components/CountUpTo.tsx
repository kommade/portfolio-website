"use client";

import { useEffect, useMemo, useRef, useState } from "react";

// Adapted from alldigitalfuture/src/components/CountUpTo.tsx: start once in view,
// then advance from zero with requestAnimationFrame.
export default function CountUpTo({ value, suffix = "", prefix = "", startDelay = 0, duration = 2500, decimalPlaces = 0, useGrouping = false, finalText }: {
    value: number; suffix?: string; prefix?: string; startDelay?: number; duration?: number; decimalPlaces?: number; useGrouping?: boolean; finalText?: string;
}) {
    const [count, setCount] = useState<number | null>(null);
    const elementRef = useRef<HTMLSpanElement>(null);
    const format = useMemo(() => new Intl.NumberFormat("en-US", { minimumFractionDigits: decimalPlaces, maximumFractionDigits: decimalPlaces, useGrouping }), [decimalPlaces, useGrouping]);
    const final = finalText ?? `${prefix}${format.format(value)}${suffix}`;

    useEffect(() => {
        const element = elementRef.current;
        const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
        if (!element || motion.matches || !Number.isFinite(value)) return;
        let frame = 0, timeout: ReturnType<typeof setTimeout> | undefined, started = false;
        const stop = () => { cancelAnimationFrame(frame); clearTimeout(timeout); observer.disconnect(); setCount(null); };
        const observer = new IntersectionObserver(([entry]) => {
            if (!entry.isIntersecting || started) return;
            started = true; observer.disconnect();
            // Pick once when starting on the client, keeping server markup deterministic.
            const animationDuration = duration * (0.8 + Math.random() * 0.4);
            setCount(0);
            timeout = setTimeout(() => {
                let startTime: number | null = null;
                const tick = (timestamp: number) => {
                    startTime ??= timestamp;
                    const progress = animationDuration <= 0 ? 1 : Math.min((timestamp - startTime) / animationDuration, 1);
                    // Quartic ease-out: move quickly at first, then linger near the target.
                    const eased = 1 - (1 - progress) ** 4;
                    const precision = 10 ** decimalPlaces;
                    setCount(progress === 1 ? null : Math.trunc(eased * value * precision) / precision);
                    if (progress < 1) frame = requestAnimationFrame(tick);
                };
                frame = requestAnimationFrame(tick);
            }, Math.max(0, startDelay));
        }, { threshold: .5 });
        const motionChanged = () => { if (motion.matches) stop(); };
        observer.observe(element);
        motion.addEventListener("change", motionChanged);
        return () => { observer.disconnect(); cancelAnimationFrame(frame); clearTimeout(timeout); motion.removeEventListener("change", motionChanged); };
    }, [value, decimalPlaces, duration, startDelay]);

    return <span className="count-up-value" ref={elementRef}>
        <span className="count-up-measure" aria-hidden="true">{final}</span>
        <span className="count-up-number" aria-hidden="true">{count === null ? final : `${prefix}${format.format(count)}${suffix}`}</span>
        <span className="count-up-accessible">{final}</span>
    </span>;
}
