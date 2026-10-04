"use client";

import PortfolioShell from "@/components/PortfolioShell";
import HomeSections from "@/components/HomeSections";
import { useSearchParams } from "next/navigation";
import { usePopUp, PopUpComponent, ScrollToTop } from "@/components/index";
import Image from "next/image";
import { logout } from "@/functions/actions";
import { useEffect } from "react";
import TextileWeaveHero from "@/components/TextileWeaveHero";

export default function Home() {
    const searchParams = useSearchParams();
    const expired = searchParams.get("expired") === "true";
    const [popUp, setPopUp] = usePopUp();
    useEffect(() => {
        if (expired) {
            logout();
            setPopUp({ message: "Please log in again", type: "warning", duration: 1000 })
        }
    }, [expired]);

    return (
        <PortfolioShell className="portfolio-home">
            <div className="home-content">
                <ScrollToTop />

                <section className="hero-section">
                    <div className="hero-viewport">
                        <div className="hero-canvas">
                        <div aria-hidden="true" className="hero-weave">
                            <TextileWeaveHero />
                        </div>
                        <div className="hero-intro">
                            <Image aria-hidden="true" className="hero-decoration hero-dots" src="/images/hero-dots.svg" width={182} height={114} alt="" />
                            <h1 className="h1 hero-name">Juliette Khoo</h1>
                            <div className="hero-roles">
                                <span className="h4 hero-role">experience designer
                                    <Image aria-hidden="true" className="hero-decoration hero-experience" src="/images/hero-experience.svg" width={343} height={57} alt="" />
                                    <Image aria-hidden="true" className="hero-decoration hero-star" src="/images/hero-star.svg" width={21} height={21} alt="" />
                                </span>
                                <span className="h4 hero-role">storyteller
                                    <Image aria-hidden="true" className="hero-decoration hero-underline" src="/images/hero-underline.svg" width={172} height={15} alt="" />
                                </span>
                                <span className="h4 hero-role">strategist
                                    <Image aria-hidden="true" className="hero-decoration hero-strategist" src="/images/hero-strategist.svg" width={150} height={80} alt="" />
                                </span>
                            </div>
                        </div>
                        </div>
                    </div>
                </section>

                <HomeSections />
                <PopUpComponent popUpProps={popUp}/>

            </div>
        </PortfolioShell>
    )
}
