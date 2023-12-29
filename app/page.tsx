import Image from 'next/image';
import GridComponent from "@/components/GridComponent";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-between overflow-x-clip">
      <div className="w-screen relative flex flex-col">
        <header className="title-header w-full h-fit fixed z-10 bg-orange-50 flex flex-col justify-center border-b-2 border-neutral-400">
          <h1 className="text-center text-blue-500 text-[40px] font-normal font-['Junicode'] p-1">
            Juliette Khoo
          </h1>
        </header>

        <section className="work-display w-[85%] h-fit left-[7.5%] relative justify-center mt-28 grid grid-cols-1 lg:grid-cols-3 grid-flow-row gap-y-6 gap-x-0 lg:gap-x-6 xl:gap-8 2xl:gap-10">
          <GridComponent
            popup="How might we design a meditative and safe space to rest and relax?"
            title="CapitaStar UX/UI"
            year="2019"
          />

          <GridComponent
            popup="How might we encourage neighbors to communicate their grievances with each other so as to promote harmonious living?"
            title="BlockTalk"
            year="2023"
          />

          <GridComponent
            popup="placeholder"
            title="Kindergarten"
            year="2020"
            row={2}
            img="https://via.placeholder.com/510x854"
          />

          <GridComponent
            popup="placeholder"
            title="Window to Another World"
            year="2023"
            col={2}
            img="https://via.placeholder.com/1062x412"
          />

          <GridComponent
            popup="placeholder"
            title="Critical Moves"
            year="2022"
          />

          <GridComponent
            popup="placeholder"
            title="Dream Machine"
            year="2022"
          />

          <GridComponent
            popup="placeholder"
            title="Drawing on the Ordinary"
            year="2022"
          />
        </section>
         
        <section className="w-full h-[656px] mt-16 relative border-t border-neutral-400 flex flex-col justify-start">
          <h2 className="text-center grid-title">
            About Me
          </h2>
          <article className="info-container flex justify-center">
            <section className="photo-competencies flex flex-col mr-4">
              <img
                className=""
                src="https://cdn.myportfolio.com/e5eed4ea-cfaa-4dbb-a47a-b4cea49e8024/d6503de0-057b-4fc3-9556-4d8fcf7cedfb_rw_1200.jpg?h=912b99a49b81440a1d427d7fe18629af"
                width="176.62" />
              <ul className="about justify-between">
                <li className="font-semibold">
                  COMPETENCIES<br />
                </li>
                <li>
                  Usability Testing<br />User Research<br />Design Thinking<br />2D and 3D Prototyping<br />Design Strategy<br />
                </li>
                <li className="font-semibold">
                  TECHNICAL SKILLS<br />
                </li>
                <li>
                  Photoshop, Illustrator, InDesign,<br /> Figma, Miro, Keynote, Rhino 7
                </li>
              </ul>
            </section>
            <section className="w-[35%] h-full p-4 bg-white flex flex-col justify-between">
              <p className="about"> 
              My name is Juliette and I grew up in the sunny island of Singapore. Since I was little, I've always been busy making things with my hands.<br /> <br />After graduating with a BSc (Hons) in Architecture from the University of Bath in 2023, I returned to Singapore to pursue a career in user research & user experience design. I'm interested in how we can create digital experiences that are not only seamless but have a personal, human touch embedded in them.<br /><br />Drop me a line if you're interested to chat!
              </p>
              <ul className="w-[60%] h-[10%] items-end inline-flex mt-4 mb-[5%] ml-auto mr-[5%] justify-between max-w-[145px] gap-[10%]">
                <li>
                  <a target="_blank" rel="noopener noreferrer">
                    <Image
                      src="/icons/email.svg"
                      alt="email svg"
                      width={24}
                      height={24}
                    />
                  </a>
                </li>
                <li>
                  <a href="https://www.instagram.com/JUEKO_/" target="_blank" rel="noopener noreferrer">
                    <Image
                      src="/icons/instagram.svg"
                      alt="insta svg"
                      width={24}
                      height={24}
                    />
                  </a>
                </li>
                <li>
                  <a href="https://www.linkedin.com/in/juliette-khoo/" target="_blank" rel="noopener noreferrer">
                    <Image
                      src="/icons/linkedin.svg"
                      alt="linkedin svg"
                      width={24}
                      height={24}
                    />
                  </a>
                </li>
                <li>
                  <a href="https://medium.com/@khoo.juliette" target="_blank" rel="noopener noreferrer">
                    <Image
                      src="/icons/m.svg"
                      alt="medium svg"
                      width={24}
                      height={24}
                    />
                  </a>
                </li>
              </ul>
            </section>
          </article>
        </section>
      </div>
    </main>
  )
}
