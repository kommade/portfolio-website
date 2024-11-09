// https://github.com/ethanniser/NextFaster/blob/main/src/components/ui/link.tsx

"use client";

import { prefetchImagesForURL } from "@/functions/actions";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type PrefetchImage = {
    srcset: string;
    sizes: string;
    src: string;
    alt: string;
    loading: string;
};

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function prefetchImages(href: string) {
    if (!href.startsWith("/") || href.startsWith("/order") || href === "/") {
        return [];
    }
    const url = new URL(href, window.location.href);
    // modified to use server actions instead of API
    const imageResponse = await prefetchImagesForURL(url.pathname);
    // only throw in dev
    if (!imageResponse.ok && process.env.NODE_ENV === "development") {
        throw new Error("Failed to prefetch images");
    }
    return imageResponse.images as PrefetchImage[];
}

const seen = new Set<string>();

const Link: typeof NextLink = (({ children, ...props }) => {
    const [images, setImages] = useState<PrefetchImage[]>([]);
    const [preloading, setPreloading] = useState<(() => void)[]>([]);
    const linkRef = useRef<HTMLAnchorElement>(null);
    const router = useRouter();
    
    useEffect(() => {
        let prefetchTimeout: NodeJS.Timeout | null = null; // Track the timeout ID
        if (props.prefetch === false) {
            return;
        }

        const linkElement = linkRef.current;
        if (!linkElement) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];
                if (entry.isIntersecting) {
                    // Set a timeout to trigger prefetch after 1 second
                    prefetchTimeout = setTimeout(async () => {
                        router.prefetch(String(props.href));
                        await sleep(0); // We want the doc prefetches to happen first.
                        void prefetchImages(String(props.href)).then((images) => {
                            setImages(images);
                        }, console.error);
                        // Stop observing once images are prefetched
                        observer.unobserve(entry.target);
                    }, 300); // 300ms delay
                } else if (prefetchTimeout) {
                    // If the element leaves the viewport before 1 second, cancel the prefetch
                    clearTimeout(prefetchTimeout);
                    prefetchTimeout = null;
                }
            },
            { rootMargin: "0px", threshold: 0.1 }, // Trigger when at least 10% is visible
        );

        observer.observe(linkElement);

        return () => {
            observer.disconnect(); // Cleanup the observer when the component unmounts
            if (prefetchTimeout) {
                clearTimeout(prefetchTimeout); // Clear any pending timeouts when component unmounts
            }
        };
    }, [props.href, props.prefetch]);

    return (
        <NextLink
            ref={linkRef}
            prefetch={false}
            onMouseEnter={() => {
                router.prefetch(String(props.href));
                if (preloading.length) return;
                const p: (() => void)[] = [];
                for (const image of images) {
                    const remove = prefetchImage(image);
                    if (remove) p.push(remove);
                }
                setPreloading(p);
            }}
            onMouseLeave={() => {
                for (const remove of preloading) {
                    remove();
                }
                setPreloading([]);
            }}
            onMouseDown={(e) => {
                const url = new URL(String(props.href), window.location.href);
                if (
                    url.origin === window.location.origin &&
                    e.button === 0 &&
                    !e.altKey &&
                    !e.ctrlKey &&
                    !e.metaKey &&
                    !e.shiftKey
                ) {
                    e.preventDefault();
                    router.push(String(props.href));
                }
            }}
            {...props}
        >
            {children}
        </NextLink>
    );
}) as typeof NextLink;

function prefetchImage(image: PrefetchImage) {
    if (image.loading === "lazy" || seen.has(image.srcset)) {
        return;
    }
    const img = new Image();
    img.decoding = "async";
    img.fetchPriority = "low";
    img.sizes = image.sizes;
    seen.add(image.srcset);
    img.srcset = image.srcset;
    img.src = image.src;
    img.alt = image.alt;
    let done = false;
    img.onload = img.onerror = () => {
        done = true;
    };
    return () => {
        if (done) return;
        img.src = img.srcset = "";
        seen.delete(image.srcset);
    };
}

export default Link;