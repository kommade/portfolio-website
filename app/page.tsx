"use client";

import GridComponents from "@/components/GridComponents";
import HeaderComponent from "@/components/HeaderComponent";
import FooterComponent from "@/components/FooterComponent";
import { getAllProjects } from "@/actions/actions";
import { useEffect, useState } from "react";
import ScrollToTop from "@/components/ScrollToTop";

function Home() {
  const [keys, setKeys] = useState<string[]>([])
  useEffect(() => {
    const fetchKeys = async () => {
      const res = await getAllProjects();
      setKeys(res);
    }
    fetchKeys();
  }, [])
  return (
    <main className="flex flex-col items-center justify-between overflow-x-clip">
      <div className="w-screen relative flex flex-col">
        <ScrollToTop/>
        <HeaderComponent/>
        <GridComponents keys={keys} max={12}/>
         
        <section className="w-full h-fit mt-16 relative bg-slate-400 flex flex-col justify-start">
          <h2 className="text-center about-title py-6">
            About Me
          </h2>
          <article className="info-container pb-32 h-fit ">
            <div className="flex flex-col lg:flex-row justify-center items-center lg:items-stretch">
              <section className="photo-competencies flex flex-col lg:mr-6 items-start">
                <div className=" w-[198px] h-[256px] overflow-hidden">
                  <img
                    className="object-cover object-bottom"
                    src="https://cdn.myportfolio.com/e5eed4ea-cfaa-4dbb-a47a-b4cea49e8024/d6503de0-057b-4fc3-9556-4d8fcf7cedfb_rw_1200.jpg?h=912b99a49b81440a1d427d7fe18629af"
                    alt="profile photo"
                  />
                </div>
                <ul className="about text-white flex flex-col items-start py-4 lg:pb-0">
                  <li className="font-semibold">
                    COMPETENCIES<br />
                  </li>
                  <li>
                    Usability Testing<br />User Research<br />Design Thinking<br />2D and 3D Prototyping<br />Design Strategy<br />
                  </li>
                  <li className="font-semibold pt-4">
                    TECHNICAL SKILLS<br />
                  </li>
                  <li>
                    Photoshop, Illustrator, InDesign,<br /> Figma, Miro, Keynote, Rhino 7
                  </li>
                </ul>
              </section>
              <section className="w-[35%] min-w-[400px] p-8 bg-white flex flex-col justify-between lg:self-stretch">
                <p className="about"> 
                  My name is Juliette and I grew up in the sunny island of Singapore. Since I was little, I&apos;ve always been busy making things with my hands. <br /><br />
                  After graduating with a BSc (Hons) in Architecture from the University of Bath in 2023, I returned to Singapore to pursue a career in user research &
                  user experience design & strategy. I&apos;m a <strong>visual storyteller</strong> interested in <strong>using technology as an interactive point of
                  engagement with the user</strong>. My cross-disciplinary background pushes me to dream bigger, better, and beyond the digital screen. <br /><br />
                  Current areas of interest include: Information design, data journalism, user experience design, strategic design
                </p>
                <button className="w-[50%] h-[10%] mt-2 place-self-center flex justify-center items-center bg-white rounded-[15px] border border-gray-700">
                  <div className="w-full h-fit text-center text-gray-700 text-base font-light font-['Epilogue'] leading-normal tracking-tight">
                    Drop me a message
                  </div>
                </button>
                <button className="w-[50%] h-[10%] mb-2 place-self-center flex justify-center items-center bg-white rounded-[15px] border border-gray-700">
                  <div className="w-full h-fit text-center text-gray-700 text-base font-light font-['Epilogue'] leading-normal tracking-tight">
                    Fun stuff I&apos;ve made 
                  </div>
                </button>
              </section>
            </div>
          </article>
        </section>
        <FooterComponent/>
      </div>
    </main>
  )
}
export default Home;
