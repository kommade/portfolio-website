"use client";

import Link from "@/components/ui/link";
import { useSearchParams } from "next/navigation";
import { usePopUp, HeaderComponent, GridComponents, PopUpComponent, FooterComponent, ScrollToTop, ScrollComponent } from "@/components";
import Image from "next/image";
import { logout } from "@/functions/actions";
import { useEffect } from "react";
import { ProjectThumbnailResponse } from "@/components/GridComponents";
import TextileWeaveHero from "@/components/TextileWeaveHero";

type HomeProps = {
    keys: string[];
    response: ProjectThumbnailResponse;
};

export default function Home({ keys, response }: HomeProps) {
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
        <main className="flex flex-col items-center justify-between overflow-x-clip">
            <div className="w-screen h-fit min-h-[100vh] relative flex flex-col">
                <ScrollToTop />
                <HeaderComponent />
                <section className="hero-section relative flex w-full items-start justify-center overflow-hidden border-x border-monsoon-700 bg-sage-green-50 mt-[96px]">
                    <div className="hero-viewport relative">
                        <div className="hero-canvas absolute left-1/2 top-0">
                        <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-[-50px] w-full -translate-x-1/2 opacity-80">
                            <TextileWeaveHero />
                        </div>
                        <div className="absolute left-1/2 top-[209.79px] z-10 flex -translate-x-1/2 flex-col items-center gap-6 py-[3px] text-center leading-[1.2]">
                            <h1 className="!m-0 !min-w-max !text-[96px] !leading-[1.2] !text-jacksons-purple-500">Juliette Khoo</h1>
                            <div className="flex min-w-max items-start justify-center gap-12 font-[Gascogne] text-[36px] tracking-[0.72px] text-sage-green-800">
                                <span>experience designer</span>
                                <span>storyteller</span>
                                <span>strategist</span>
                            </div>
                        </div>
                        <img aria-hidden="true" className="pointer-events-none absolute left-[278px] top-[349px] z-20 h-[56.923px] w-[343px]" src="/images/hero-experience.svg" alt="" />
                        <img aria-hidden="true" className="pointer-events-none absolute left-[653px] top-[384px] z-20 h-[15.191px] w-[169.197px] rotate-[-1.08deg]" src="/images/hero-underline.svg" alt="" />
                        <img aria-hidden="true" className="pointer-events-none absolute left-[575px] top-[87px] z-20 h-[110.225px] w-[178.004px]" src="/images/hero-dots.svg" alt="" />
                        <img aria-hidden="true" className="pointer-events-none absolute left-[358px] top-[339px] z-20 h-[20.413px] w-[20.413px] rotate-[-8.31deg]" src="/images/hero-star.svg" alt="" />
                        <img aria-hidden="true" className="pointer-events-none absolute left-[835px] top-[329px] z-20 h-[79.773px] w-[149.815px]" src="/images/hero-strategist.svg" alt="" />
                        </div>
                    </div>
                </section>

                {/* <GridComponents keys={keys} response={response} max={12} />
                <div className="w-[85%] mx-[7.5%] h-fit flex my-[32px] justify-center items-end">
                    <Link href="/projects" rel="noopener noreferrer">
                        <h5 className="text-warm-grey hover:text-black transition-colors">See all</h5>
                    </Link>
                </div> */}
                <section className="w-full h-fit relative bg-slate-400 flex justify-start">
                    <article className="info-container lg:p-16 p-4 h-fit ">
                        <div className="flex flex-col lg:flex-row justify-center items-center lg:items-stretch">
                            <div className="rotate-180 lg:rotate-0 lg:mr-[10px] mb-[10px] lg:mb-0 ">
                                <h1 className="text-end lg:self-start !text-pale-butter lg:[writing-mode:vertical-lr] animate-hidden left rotate">
                                    About Me
                                </h1>
                            </div>
                            <section className=" flex flex-col lg:mr-6 items-start">
                                <div className=" w-[198px] h-[256px] overflow-hidden animate-hidden left delay-[500ms]">
                                    <Image
                                        className="object-cover object-bottom"
                                        src="/images/about-me.jpg"
                                        alt="profile photo"
                                        width={198}
                                        height={256}
                                        draggable={false}
                                        onContextMenu={(e) => e.preventDefault()}
                                    />
                                </div>
                                <ul className="text-white flex flex-col items-start py-4 lg:pb-0 animate-hidden left delay-[800ms]">
                                    <li className="xs-semibold">
                                        COMPETENCIES<br />
                                    </li>
                                    <li className="xs-regular">
                                        Usability Testing<br />User Research<br />Design Thinking<br />2D and 3D Prototyping<br />Design Strategy<br />
                                    </li>
                                    <li className="xs-semibold pt-4">
                                        TECHNICAL SKILLS<br />
                                    </li>
                                    <li className="xs-regular">
                                        Photoshop, Illustrator, InDesign,<br /> Figma, Miro, Keynote, Rhino 7
                                    </li>
                                </ul>
                            </section>
                            <section className="w-[35%] min-w-[300px] lg:min-w-[400px] p-8 bg-pale-butter flex flex-col justify-between lg:self-stretch animate-hidden right delay-[500ms]">
                                <p className="xs-regular animate-hidden right delay-[300ms]"> 
                                My name is Juliette and I grew up in the sunny island of Singapore. Since I was little, I&apos;ve always been busy making things with my hands. <br /><br />
                                After graduating with a BSc (Hons) in Architecture from the University of Bath in 2023, I returned to Singapore to pursue a career in user research &
                                user experience design & strategy. I&apos;m a <strong>visual storyteller</strong> interested in <strong>using technology as an interactive point of
                                engagement with the user</strong>. My cross-disciplinary background pushes me to dream bigger, better, and beyond the digital screen. <br /><br />
                                Current areas of interest include: Information design, data journalism, user experience design, strategic design
                                </p>
                                <div className="w-full h-full flex flex-col justify-center items-center gap-4 lg:gap-6 animate-hidden right delay-[300ms]">
                                    <Link
                                        className="w-[50%] h-[10%] min-h-[40px] mt-4 place-self-center flex justify-center items-center bg-white rounded-[15px] border border-eggplant-purple transform transition duration-500 ease-in-out hover:scale-110 hover:cursor-pointer"
                                        href="/contact"
                                        rel="noopener noreferrer"
                                    >
                                    <div className="w-full h-fit text-center text-eggplant-purple s-regular">
                                        Drop me a message
                                    </div>
                                    </Link>
                                    <Link
                                        className="w-[50%] h-[10%] min-h-[40px] place-self-center flex justify-center items-center bg-white rounded-[15px] border border-eggplant-purple transform transition duration-500 ease-in-out hover:scale-110 hover:cursor-pointer"
                                        href="/fun-stuff"
                                        rel="noopener noreferrer"
                                    >
                                    <div className="w-full h-fit text-center text-eggplant-purple s-regular">
                                        Fun stuff I&apos;ve made 
                                    </div>
                                    </Link>
                                </div>
                            </section>
                        </div>
                    </article>
                </section>
                <ScrollComponent />
                <PopUpComponent popUpProps={popUp}/>
                <FooterComponent/>
            </div>
        </main>
    )
}
