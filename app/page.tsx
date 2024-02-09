"use client";

import { getAllProjects } from "@/functions/actions";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { usePopUp, HeaderComponent, GridComponents, PopUpComponent, FooterComponent, ScrollToTop, ScrollComponent } from "@/components";

function Home() {
    const router = useRouter()
    const searchParams = useSearchParams();
    const expired = searchParams.get("expired") === "true";
    const [popUp, setPopUp] = usePopUp();
    const [keys, setKeys] = useState<string[]>([])
    useEffect(() => {
        if (expired) {
            setPopUp({ message: "Please log in again", type: "warning", duration: 1000 })
        }
        const fetchKeys = async () => {
        const res = await getAllProjects();
        setKeys(res);
        }
        fetchKeys();
    }, [expired, setPopUp])
    return (
        <main className="flex flex-col items-center justify-between overflow-x-clip">
            <div className="w-screen h-fit min-h-[100vh] relative flex flex-col">
                <ScrollToTop />
                <HeaderComponent/>
                <GridComponents keys={keys} max={12}/>
                
                <section className="w-full h-fit mt-16 relative bg-slate-400 flex justify-start">
                
                <article className="info-container lg:p-16 p-4 h-fit ">
                        <div className="flex flex-col lg:flex-row justify-center items-center lg:items-stretch">
                        <h1 className="text-end lg:self-start text-pale-butter lg:[writing-mode:vertical-lr] lg:rotate-180 lg:mr-[10px] mb-[10px] lg:mb-0">
                            About Me
                        </h1>
                        <section className=" flex flex-col lg:mr-6 items-start">
                            <div className=" w-[198px] h-[256px] overflow-hidden">
                            <img
                                className="object-cover object-bottom"
                                src="https://cdn.myportfolio.com/e5eed4ea-cfaa-4dbb-a47a-b4cea49e8024/d6503de0-057b-4fc3-9556-4d8fcf7cedfb_rw_1200.jpg?h=912b99a49b81440a1d427d7fe18629af"
                                alt="profile photo"
                            />
                            </div>
                            <ul className="text-white flex flex-col items-start py-4 lg:pb-0">
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
                        <section className="w-[35%] min-w-[400px] p-8 bg-pale-butter flex flex-col justify-between lg:self-stretch">
                            <p className="xs-regular"> 
                            My name is Juliette and I grew up in the sunny island of Singapore. Since I was little, I&apos;ve always been busy making things with my hands. <br /><br />
                            After graduating with a BSc (Hons) in Architecture from the University of Bath in 2023, I returned to Singapore to pursue a career in user research &
                            user experience design & strategy. I&apos;m a <strong>visual storyteller</strong> interested in <strong>using technology as an interactive point of
                            engagement with the user</strong>. My cross-disciplinary background pushes me to dream bigger, better, and beyond the digital screen. <br /><br />
                            Current areas of interest include: Information design, data journalism, user experience design, strategic design
                            </p>
                            <div className="w-full h-full flex flex-col justify-center items-center gap-4 lg:gap-6">
                                <Link
                                className="w-[50%] h-[10%] min-h-[40px] mt-2 place-self-center flex justify-center items-center bg-white rounded-[15px] border border-eggplant-purple transform transition duration-500 ease-in-out hover:scale-110 hover:cursor-pointer"
                                href="/contact"
                                rel="noopener noreferrer"
                                >
                                <div className="w-full h-fit text-center text-eggplant-purple s-regular">
                                    Drop me a message
                                </div>
                                </Link>
                                <Link
                                className="w-[50%] h-[10%] min-h-[40px] mb-2 place-self-center flex justify-center items-center bg-white rounded-[15px] border border-eggplant-purple transform transition duration-500 ease-in-out hover:scale-110 hover:cursor-pointer"
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
export default Home;
