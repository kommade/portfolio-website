export default function HomeSections() {
    return <>
        <section className="home-section" id="about" aria-labelledby="about-title">
            <div className="home-section-layout">
                <div className="home-photo-placeholder" aria-hidden="true"><img className="home-tape home-tape-about" src="/design/about-tape.png" alt="" /></div>
                <div className="home-section-copy">
                    <h2 className="section-heading" id="about-title">About Me</h2>
                    <p>I’m a designer who strives to improve products, services and experiences through a deep understanding of users. After four years of architecture school at the University of Bath, I was familiar with the rigour of technical design, equipped with the brains of a systems thinker and driven by the excitement of crafting narratives and experiences for people. However, I felt that my work lacked meaning. To me, meaningful work is work that listens to the voice of the customer.</p>
                    <p>Today, I listen and speak to users about their motivations and pain points. I draw inferences about their behaviour from my interviews with them, and translate these insights into evidence-based design. While I primarily work with digital interfaces, my interest also lies in designing for omnichannel journeys that involve online and offline touchpoints.</p>
                    <p>As a design consultant, I place great importance in convincing stakeholders of the value in investing in solid research and design. My speciality lies in crafting compelling visual narratives and workshop activities that draw stakeholders closer to their customers.</p>
                    <p>Outside of work, my hobbies involve: taking forever to read books, knitting and crocheting, dreaming up new DIY projects, and getting in a good workout. Once in a blue moon, I also write.</p>
                </div>
            </div>
        </section>
        <section className="home-section" id="skills" aria-labelledby="skills-title">
            <div className="home-section-layout home-skills-layout">
                <div className="home-section-copy">
                    <h2 className="section-heading" id="skills-title">Skills and Competencies</h2>
                    <ul><li>Qualitative User Research</li><li>Workshop Planning &amp; Execution</li><li>Mapping Current State and Future State Journeys</li><li>Archetype Development</li><li>Visual Storytelling</li><li>Usability Testing</li><li>Stakeholder Engagement</li></ul>
                    <ul><li>Figma</li><li>Adobe Creative Suite (PS, ID, AI)</li><li>Rhino 7</li><li>html/css/java</li><li>Qualtrics</li></ul>
                </div>
                <div className="home-photo-placeholder" aria-hidden="true"><img className="home-tape home-tape-skills" src="/design/skills-tape.png" alt="" /><img className="home-tape home-tape-bottom" src="/design/skills-bottom-tape.png" alt="" /></div>
            </div>
        </section>
    </>;
}
