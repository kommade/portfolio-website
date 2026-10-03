import Image from "next/image";

export default function HomeSections() {
    return <>
        <section className="home-section" id="about" aria-labelledby="about-title">
            <div className="home-section-layout">
                <div className="home-photo">
                    <Image className="home-portrait" src="/images/about-me.jpg" alt="Juliette Khoo outdoors" fill sizes="(max-width:800px) 85vw, 332px" />
                    <Image className="home-tape home-tape-about" src="/design/about-tape.png" width={121} height={109} alt="" />
                </div>
                <div className="home-section-copy">
                    <h2 className="h5 section-heading" id="about-title">About Me</h2>
                    <p className="l-regular">I’m a designer who strives to improve products, services and experiences through a deep understanding of users. After four years of architecture school at the University of Bath, I was familiar with the rigour of technical design, equipped with the brains of a systems thinker and driven by the excitement of crafting narratives and experiences for people. However, I felt that my work lacked meaning. To me, meaningful work is work that listens to the voice of the customer.</p>
                    <p className="l-regular">Today, I listen and speak to users about their motivations and pain points. I draw inferences about their behaviour from my interviews with them, and translate these insights into evidence-based design. While I primarily work with digital interfaces, my interest also lies in designing for omnichannel journeys that involve online and offline touchpoints.</p>
                    <p className="l-regular">As a design consultant, I place great importance in convincing stakeholders of the value in investing in solid research and design. My speciality lies in crafting compelling visual narratives and workshop activities that draw stakeholders closer to their customers.</p>
                    <p className="l-regular">Outside of work, my hobbies involve: taking forever to read books, knitting and crocheting, dreaming up new DIY projects, and getting in a good workout. Once in a blue moon, I also write.</p>
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
                    <Image className="home-tape home-tape-skills" src="/design/skills-tape.png" width={132} height={103} alt="" />
                    <Image className="home-tape home-tape-bottom" src="/design/skills-bottom-tape.png" width={170} height={71} alt="" />
                </div>
            </div>
        </section>
    </>;
}
