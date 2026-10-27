import Image from "next/image";
import Link from "./ui/link";

export default function HomeSections() {
    return <>
        <section className="home-section" id="about" aria-labelledby="about-title">
            <div className="home-section-layout">
                <div className="home-photo">
                    <Image className="home-portrait" src="/images/about-me.jpeg" alt="Juliette Khoo outdoors" fill sizes="(max-width:800px) 85vw, 332px" />
                    <Image className="home-tape home-tape-about" src="/design/about-tape.svg" width={121} height={109} alt="" />
                </div>
                <div className="home-section-copy">
                    <h2 className="h5 section-heading" id="about-title">About Me</h2>
                    <p className="l-regular">I’m a designer passionate about crafting <strong>meaningful</strong> experiences for <strong>people</strong>. My work is grounded in a deep understanding of users: their motivations, behaviours and pain points, and I translate these insights into evidence-based design.</p>
                    <p className="l-regular">While I primarily work with digital interfaces, I also have experience in omnichannel and strategic design.</p>
                    <p className="l-regular">My story began with studying architecture at the University of Bath, which taught me to approach technical implementation with rigour and to think in systems. A short stint as a UX intern drew me to experience design because it allowed me to engage more directly with users and make their voices central to the design process.</p>
                    <p className="l-regular">As a design consultant, I place great importance on helping stakeholders see the value of investing in robust research and design. My speciality lies in crafting compelling visual narratives and workshop activities that bring stakeholders closer to their customers.</p>
                    <p className="l-regular">Outside of work, I enjoy taking forever to finish books, knitting and crocheting, dreaming up new DIY projects, and getting in a good workout. Once in a blue moon, I also <Link className="underline" target="_blank" rel="noopener noreferrer" href="https://medium.com/@khoo.juliette">write</Link>.</p>
                </div>
            </div>
        </section>
        <section className="home-section" id="skills" aria-labelledby="skills-title">
            <div className="home-section-layout home-skills-layout">
                <div className="home-section-copy">
                    <h2 className="h5 section-heading" id="skills-title">Skills and Competencies</h2>
                    <ul><li className="l-regular">Qualitative User Research</li><li className="l-regular">Workshop Planning &amp; Execution</li><li className="l-regular">Mapping Current State and Future State Journeys</li><li className="l-regular">Archetype Development</li><li className="l-regular">Visual Storytelling</li><li className="l-regular">Usability Testing</li><li className="l-regular">Stakeholder Engagement</li></ul>
                    <ul><li className="l-regular">Figma</li><li className="l-regular">Adobe Creative Suite (PS, ID, AI)</li><li className="l-regular">Rhino 7</li><li className="l-regular">html/css/java</li><li className="l-regular">Qualtrics</li></ul>
                </div>
                <div className="home-photo">
                    <Image className="home-portrait" src="/images/skills-competencies.jpeg" alt="A hand-drawn workspace with a computer, sketchbooks and design tools" fill sizes="(max-width:800px) 85vw, 332px" />
                    <Image className="home-tape home-tape-skills" src="/design/skills-tape.svg" width={132} height={103} alt="" />
                    <Image className="home-tape home-tape-bottom" src="/design/skills-bottom-tape.svg" width={170} height={71} alt="" />
                </div>
            </div>
        </section>
    </>;
}
