import Image from 'next/image';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between overflow-x-clip">
      <div className="w-screen h-[2217px] relative bg-white ">

        <div className="w-[91.67%] h-[5.7%] left-[4.17%] top-0 absolute flex flex-col justify-between ">
          <div className="text-center text-black text-[40px] font-normal font-['Junicode'] bg-zinc-400 p-1">
            Juliette Khoo
          </div>
          <div className="text-center text-black text-xl font-normal font-['Junicode'] leading-tight pt-8">
            I’m a dreamer and a UX designer, currently based in Singapore. Here’s some of my work:
          </div>
        </div>

        <div className="w-[28.89%] h-[18.76%] left-[5%] top-[9.57%] absolute bg-zinc-400" />
        <div className="w-[27.35%] h-[13.54%] left-[5.83%] top-[10.03%] absolute bg-white" />
        <div className="w-[19.58%] h-[1.76%] left-[10%] top-[16.32%] absolute text-center text-black text-sm font-normal font-['Epilogue'] leading-[0.85rem]">
          How might we design a meditative and safe space to rest and relax?
        </div>
        <div className="w-[27.01%] h-[1.76%] left-[6.25%] top-[24.61%] absolute grid-title">
          CapitaStar UX/UI
        </div>
        <div className="w-[27.01%] h-[0.95%] left-[6.25%] top-[26.81%] absolute text-black text-xl font-normal font-['Epilogue']">2019</div>

        <div className="w-[28.89%] h-[18.76%] left-[35.56%] top-[9.57%] absolute bg-zinc-400" />
        <div className="w-[27.35%] h-[13.54%] left-[36.39%] top-[10.11%] absolute bg-white" />
        <div className="w-[19.58%] h-16 left-[40.63%] top-[15.81%] absolute text-center text-black text-sm font-normal font-['Epilogue'] leading-[0.85rem]">
          How might we encourage neighbours to communicate their grievances with each other so as to promote harmonious living?
        </div>
        <div className="w-[27.01%] h-[1.76%] left-[36.39%] top-[24.61%] absolute grid-title">
          BlockTalk
        </div>
        <div className="w-[27.01%] h-[0.95%] left-[36.81%] top-[26.81%] absolute text-black text-xl font-normal font-['Epilogue']">2023</div>
        
        <div className="w-[28.89%] h-[18.76%] left-[66.11%] top-[9.57%] absolute bg-zinc-400 kindergarten-bg-top" />
        <div className="w-[28.89%] h-[18.86%] left-[66.11%] top-[28.30%] absolute bg-zinc-400 kindergarten-bg-bot" />
        <div className="w-[27.35%] h-[27.02%] left-[66.81%] top-[10.03%] absolute bg-white" />
        <div className="w-[27.01%] h-[1.76%] left-[66.53%] top-[38.48%] absolute grid-title">
          Kindergarten
        </div>
        <div className="w-[27.01%] h-[0.95%] left-[66.53%] top-[40.69%] absolute text-black text-xl font-normal font-['Epilogue']">
          2020
        </div>

        <div className="w-[59.44%] h-[17.58%] left-[5%] top-[29.58%] absolute bg-zinc-400" />
        <div className="w-[57.36%] h-[12.86%] left-[6.04%] top-[30.49%] absolute bg-white" />
        <div className="w-[27.01%] h-[1.76%] left-[5.69%] top-[43.77%] absolute grid-title">
          Window to Another World
        </div>
        <div className="w-[27.01%] h-[0.95%] left-[6.25%] top-[46.03%] absolute text-black text-xl font-normal font-['Epilogue']">
          2023
        </div>
        
        <div className="w-[28.89%] h-[18.76%] left-[5%] top-[49.11%] absolute bg-zinc-400" />
        <div className="w-[27.35%] h-[13.54%] left-[5.83%] top-[50.01%] absolute bg-white" />
        <div className="w-[27.01%] h-[1.76%] left-[5.56%] top-[63.55%] absolute grid-title">
          Critical Moves
        </div>
        <div className="w-[27.01%] h-[0.95%] left-[5.69%] top-[66.92%] absolute text-black text-xl font-normal font-['Epilogue']">
          2022
        </div>

        <div className="w-[28.89%] h-[18.76%] left-[35.56%] top-[49.11%] absolute bg-zinc-400" />
        <div className="w-[27.35%] h-[13.54%] left-[36.39%] top-[50.01%] absolute bg-white" />
        <div className="w-[27.01%] h-[1.76%] left-[36.11%] top-[63.55%] absolute grid-title">
          Dream Machine
        </div>
        <div className="w-[27.01%] h-[0.95%] left-[36.25%] top-[66.92%] absolute text-black text-xl font-normal font-['Epilogue']">
          2022
        </div>

        <div className="w-[28.89%] h-[18.76%] left-[66.11%] top-[49.11%] absolute bg-zinc-400" />
        <div className="w-[27.35%] h-[13.54%] left-[66.81%] top-[50.01%] absolute bg-white" />
        <div className="w-[27.01%] h-[1.76%] left-[66.53%] top-[63.55%] absolute grid-title">
          Drawing on the Ordinary
        </div>
        <div className="w-[27.01%] h-[0.95%] left-[66.53%] top-[66.92%] absolute text-black text-xl font-normal font-['Epilogue']">
          2022
        </div>
         
        <div className="w-[89.17%] h-[29.6%] left-[5%] top-[70.55%] absolute bg-zinc-400" />
        <div className="w-[27.01%] h-[4.47%] left-[35.69%] top-[71.06%] absolute text-center text-black text-[40px] font-normal font-['Junicode']">About Me</div>
        <div className="w-[28.75%] h-[16.53%] left-[43.33%] top-[74.54%] absolute bg-white" />
        <div className="w-[25.69%] h-[8.35%] left-[44.72%] top-[75.94%] absolute text-gray-700 text-xs font-normal font-['Epilogue'] leading-[17.40px] tracking-tight">
          My name is Juliette and I grew up in the sunny island of Singapore. Since I was little, I've always been busy making things with my hands.<br /> <br />After graduating with a BSc (Hons) in Architecture from the University of Bath in 2023, I returned to Singapore to pursue a career in user research & user experience design. I'm interested in how we can create digital experiences that are not only seamless but have a personal, human touch embedded in them.<br /><br />Drop me a line if you're interested to chat!
        </div>
        <div className="w-[10.83%] left-[59.51%] top-[92.41%] absolute justify-start items-start gap-5 inline-flex">
          <div className="w-1.25% h-1.25% relative" />
          <div className="w-1.25% h-1.25% relative" /> {/* links */}
          <div className="w-1.25% h-1.25% relative" />
          <div className="w-1.25% h-1.25% relative" />
        </div>
        <div />
        <div className="w-[13.61%] h-[8.46%] left-[28.19%] top-[87.21%] absolute">
          <span className="text-gray-700 text-xs font-semibold font-['Epilogue'] leading-[17.40px] tracking-tight">
            COMPETENCIES<br />
          </span>
          <span className="text-gray-700 text-xs font-normal font-['Epilogue'] leading-[17.40px] tracking-tight">
            Usability Testing<br />User Research<br />Design Thinking<br />2D and 3D Prototyping<br />Design Strategy<br /><br /><br />
          </span>
          <span className="text-gray-700 text-xs font-semibold font-['Epilogue'] leading-[17.40px] tracking-tight">
            TECHNICAL SKILLS<br />
          </span>
          <span className="text-gray-700 text-xs font-normal font-['Epilogue'] leading-[17.40px] tracking-tight">
            Photoshop, Illustrator, InDesign, Figma, Miro, Keynote, Rhino 7
          </span>
        </div>
      </div>
    </main>
  )
}
