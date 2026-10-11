"use client";
import Link from "next/link";
import type { ProjectData } from "@/lib/project-content";
import PortfolioShell from "./PortfolioShell";
import StoryContent from "./StoryContent";
import { AdminIcon } from "./AdminControls";
import MediaCleanupNotice from "./MediaCleanupNotice";

export default function CaseStory({ data, id, admin }: { data: ProjectData; id: string; admin: boolean }) {
<<<<<<< HEAD
    const [viewer, setViewer] = useState<number | null>(null);
    const [active, setActive] = useState("challenge");
    const { sidebar, main } = data.data;
    const sections = [{ id: "challenge", title: "The Challenge" }, ...main.body.normal.map((section,index) => ({ id: `section-${index}`, title: section.header })).filter(section => section.title)];
    if (main.body.grid.use && main.body.grid.header) sections.push({ id: "gallery", title: main.body.grid.header });
    const images = [main.cover.image, ...main.body.normal.map(section => section.image), ...(main.body.grid.use ? main.body.grid.images : [])].filter(Boolean).map((url,index) => ({ url, id: String(index), name: `${data.name} — image ${index + 1}` }));
    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            const visible = entries.find(entry => entry.isIntersecting);
            if (visible) setActive(visible.target.id);
        }, { rootMargin: "-100px 0px -55% 0px" });
        document.querySelectorAll(".story-section").forEach(section => observer.observe(section));
        return () => observer.disconnect();
    }, [data]);
    const picture = (url: string, label: string) => url && <button className="story-image" onClick={() => setViewer(images.findIndex(image => image.url === url))} aria-label={`Enlarge ${label}`}><Image src={url} alt={label} width={1200} height={800} sizes="(max-width:800px) 90vw, 911px" /></button>;
    return <PortfolioShell className="portfolio-story" tools={admin && <Link href={`/projects/${id}?edit=true`}>Edit case story</Link>}>
        <div className="story-layout">
            <article>
                <h1 className="story-title">{data.name}</h1>
                <div className="story-meta">
                    <span>{data.year}</span>
                    <span aria-hidden="true">•</span>
                    <span>{data.domain}</span>
                    <span aria-hidden="true">•</span>
                    <span>{data.sector}</span>
                </div>
                <div className="story-blocks">
                    <div><DesignChip colour="grape">Team</DesignChip><p className="s-light">{sidebar.team.join("\n")}</p></div>
                    <div><DesignChip colour="brick">Skillset</DesignChip><p className="s-light">{sidebar.skillset.join("\n")}</p></div>
                    <div><DesignChip>Methods</DesignChip><p className="s-light">{sidebar.approach.join("\n")}</p></div>
                </div>
                <section className="story-section" id="challenge"><h2>The Challenge</h2><StoryText text={main.cover.text} />{picture(main.cover.image,data.name)}</section>
                {main.body.normal.map((section,index) => <section className="story-section" id={`section-${index}`} key={index}>
                    {section.header && <h2>{section.header}</h2>}<StoryText text={section.text} />{picture(section.image,section.header || data.name)}
                </section>)}
                {main.body.grid.use && <section className="story-section" id="gallery">{main.body.grid.header && <h2>{main.body.grid.header}</h2>}<StoryText text={main.body.grid.text} /><div className="story-gallery">{main.body.grid.images.filter(Boolean).map((url,index) => <div key={index}>{picture(url,`${data.name} gallery ${index + 1}`)}</div>)}</div></section>}
            </article>
            <aside className="story-contents"><DesignChip colour="grape">Contents</DesignChip><nav aria-label="Case story contents">{sections.map(section => <a key={section.id} href={`#${section.id}`} aria-current={active === section.id ? "location" : undefined}>{section.title}</a>)}</nav><Link href="/projects">All case stories</Link></aside>
        </div>
        {viewer !== null && <PhotoViewer images={images} index={viewer} close={() => setViewer(null)} />}
=======
    return <PortfolioShell className="portfolio-story">
        {admin && <div className="story-admin-toolbar"><span className="m-regular">{data.hidden ? "Hidden · only admins can see this story" : "Admin view"}</span><Link className="l-regular admin-button" href={`/case-stories/${id}?edit=true`}>Edit<AdminIcon name="edit" /></Link></div>}
        {admin && <MediaCleanupNotice id={id} />}
        <StoryContent data={data} />
>>>>>>> b808a9149355adfbbd320243f138367bfb0d04d6
    </PortfolioShell>;
}
