"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUp, Eye, Plus, Undo2 } from "lucide-react";
import Image from "next/image";
import { saveProject } from "@/functions/project-actions";
import { discardProjectMedia } from "@/functions/media-actions";
import { projectMediaUrls, uploadedMediaKey } from "@/lib/media";
import { cardColours, newBlock, safeImage, storyBlocks, validateProject, type ProjectRecord, type StoryBlock, type StoryImage } from "@/lib/project-content";
import PortfolioShell from "./PortfolioShell";
import StoryContent from "./StoryContent";
import MediaUpload, { UploadTrackingContext } from "./MediaUpload";
import { AdminIcon } from "./AdminControls";
import { readPendingMedia, storePendingMedia } from "@/lib/pending-media-cleanup";

function Field({ label, value, change, multiline = false, help, readOnly = false }: { label: string; value: string; change: (value: string) => void; multiline?: boolean; help?: string; readOnly?: boolean }) {
    return <label className="m-regular editor-field"><span className="m-regular">{label}</span>{multiline ? <textarea className="l-regular" rows={3} value={value} onChange={event => change(event.target.value)} /> : <input className="l-regular" value={value} readOnly={readOnly} onChange={event => change(event.target.value)} />}{help && <small className="s-regular">{help}</small>}</label>;
}

function MediaUrlField({ label, value, change }: { label: string; value: string; change: (value: string) => void }) {
    const uploaded = Boolean(uploadedMediaKey(value));
    return <div className="editor-media-url"><Field label={label} value={value} change={change} readOnly={uploaded} help={uploaded ? "Uploaded file URL. Upload a replacement to change it." : undefined} />{value && <button className="l-regular admin-button" type="button" onClick={() => change("")} aria-label={`Remove ${label.replace(/ URL$/, "").toLowerCase()}`}>Remove file</button>}</div>;
}

function TextField({ value, change, label = "Text" }: { value: string; change: (value: string) => void; label?: string }) {
    const ref = useRef<HTMLTextAreaElement>(null);
    const format = (before: string, after = before, placeholder = "text") => {
        const el = ref.current!;
        const start = el.selectionStart, end = el.selectionEnd;
        const selection = value.slice(start, end) || placeholder;
        change(value.slice(0, start) + before + selection + after + value.slice(end));
        requestAnimationFrame(() => { el.focus(); el.setSelectionRange(start + before.length, start + before.length + selection.length); });
    };
    return <div className="editor-rich-field"><div className="editor-format-bar" aria-label={`${label} formatting`}>
        <button className="m-regular" type="button" onClick={() => format("**")} aria-label="Bold"><strong className="m-regular text-bold">B</strong></button><button className="m-regular" type="button" onClick={() => format("*")} aria-label="Italic"><em className="m-regular text-italic">I</em></button><button className="m-regular" type="button" onClick={() => format("[", "](https://example.com)", "link text")}>Link</button><button className="m-regular" type="button" onClick={() => format("\n- ", "", "List item")}>List</button>
    </div><label className="m-regular editor-field"><span className="m-regular">{label}</span><textarea className="l-regular" ref={ref} rows={5} value={value} onChange={event => change(event.target.value)} /></label><p className="s-regular editor-help">Select text to format it. Use Preview to see bold, italic, links and lists.</p></div>;
}

function ImageFields({ value, change, busy }: { value: StoryImage; change: (value: StoryImage) => void; busy: (value: boolean) => void }) {
    return <div className="editor-image-fields">
        {value.url && safeImage(value.url) && <Image className="editor-image-preview" src={value.url} width={420} height={280} sizes="(max-width:800px) 80vw, 420px" alt={value.alt || "Image preview"} />}
        <MediaUpload onUploaded={url => change({ ...value, url })} onBusy={busy} />
        <MediaUrlField label="Image URL" value={value.url} change={url => change({ ...value, url })} />
        <Field label="Image description (alt text)" value={value.alt} change={alt => change({ ...value, alt })} />
        <Field label="Caption" value={value.caption} change={caption => change({ ...value, caption })} />
    </div>;
}

function BlockFields({ block, change, busy, uploading }: { block: StoryBlock; change: (block: StoryBlock) => void; busy: (value: boolean) => void; uploading: boolean }) {
    switch (block.type) {
        case "heading": return <Field label="Section heading" value={block.text} change={text => change({ ...block, text })} />;
        case "text": return <TextField value={block.text} change={text => change({ ...block, text })} />;
        case "image": return <ImageFields value={block.image} change={image => change({ ...block, image })} busy={busy} />;
        case "gallery": return <><div className="editor-gallery">{block.images.map((image, index) => <fieldset className="editor-mini-card" key={index}><legend className="m-regular">Image {index + 1}</legend><ImageFields value={image} change={value => change({ ...block, images: block.images.map((item, i) => i === index ? value : item) })} busy={busy} /><button className="l-regular admin-button" type="button" disabled={uploading} onClick={() => change({ ...block, images: block.images.filter((_, i) => i !== index) })}>Remove image {index + 1}</button></fieldset>)}</div><button className="l-regular admin-button" type="button" disabled={uploading || block.images.length >= 12} onClick={() => change({ ...block, images: [...block.images, { url: "", alt: "", caption: "" }] })}><Plus />Add image</button></>;
        case "image-toggle": return <div className="editor-gallery">{block.options.map((option, index) => <fieldset className="editor-mini-card" key={index}>
            <legend className="m-regular">Image {index + 1}</legend>
            <Field label="Toggle label" value={option.label} change={label => change({ ...block, options: block.options.map((item, i) => i === index ? { ...item, label } : item) as typeof block.options })} />
            <ImageFields value={option.image} change={image => change({ ...block, options: block.options.map((item, i) => i === index ? { ...item, image } : item) as typeof block.options })} busy={busy} />
        </fieldset>)}</div>;
        case "button": return <><Field label="Button label" value={block.label} change={label => change({ ...block, label })} /><Field label="Button link" value={block.href} change={href => change({ ...block, href })} help="https://…, mailto:…, /page, or #section" /><label className="m-regular editor-check"><input type="checkbox" checked={block.newTab} onChange={event => change({ ...block, newTab: event.target.checked })} />Open in a new tab</label></>;
        case "video": return <><MediaUpload kind="video" onUploaded={url => change({ ...block, url })} onBusy={busy} /><MediaUrlField label="Video URL" value={block.url} change={url => change({ ...block, url })} /><Field label="Video title" value={block.title} change={title => change({ ...block, title })} /><Field label="Video caption" value={block.caption} change={caption => change({ ...block, caption })} /><fieldset className="editor-mini-card"><legend className="m-regular">Poster image (optional)</legend><MediaUpload onUploaded={poster => change({ ...block, poster })} onBusy={busy} /><MediaUrlField label="Poster URL" value={block.poster} change={poster => change({ ...block, poster })} /></fieldset><fieldset className="editor-mini-card"><legend className="m-regular">Accessibility captions (optional)</legend><MediaUpload kind="subtitles" onUploaded={subtitles => change({ ...block, subtitles })} onBusy={busy} /><MediaUrlField label="WebVTT captions URL" value={block.subtitles} change={subtitles => change({ ...block, subtitles })} /></fieldset></>;
        case "cards": return <><div className="editor-card-list">{block.cards.map((card, index) => <fieldset className={`editor-mini-card story-stat-${card.colour}`} key={card.id}><legend className="m-regular">Card {index + 1}</legend>
            <Field label="Value or headline" value={card.value} change={value => change({ ...block, cards: block.cards.map(item => item.id === card.id ? { ...item, value } : item) })} />
            <label className="m-regular editor-check"><input type="checkbox" checked={card.countUp === true} onChange={event => change({ ...block, cards: block.cards.map(item => item.id === card.id ? { ...item, countUp: event.target.checked } : item) })} />Count up when this card comes into view</label>
            {card.countUp && <p className="s-regular editor-help">Enter a number or percentage above, such as 1,250 or 99.1%. Preview plays the animation.</p>}
            <Field label="Card text" multiline value={card.text} change={text => change({ ...block, cards: block.cards.map(item => item.id === card.id ? { ...item, text } : item) })} />
            <label className="m-regular editor-field"><span className="m-regular">Colour</span><select className="l-regular" value={card.colour} onChange={event => change({ ...block, cards: block.cards.map(item => item.id === card.id ? { ...item, colour: event.target.value as typeof card.colour } : item) })}>{cardColours.map(colour => <option className="l-regular" key={colour} value={colour}>{colour}</option>)}</select></label>
            <div className="editor-actions"><button className="l-regular admin-button" type="button" disabled={index === 0} onClick={() => { const cards = [...block.cards]; [cards[index - 1], cards[index]] = [cards[index], cards[index - 1]]; change({ ...block, cards }); }}>Move earlier</button><button className="l-regular admin-button" type="button" disabled={block.cards.length === 1} onClick={() => change({ ...block, cards: block.cards.filter(item => item.id !== card.id) })}>Remove card</button></div>
        </fieldset>)}</div><button type="button" className="l-regular admin-button" disabled={block.cards.length >= 8} onClick={() => change({ ...block, cards: [...block.cards, { id: crypto.randomUUID(), value: "", text: "", colour: cardColours[block.cards.length % cardColours.length] }] })}><Plus />Add card</button><Field label="Cards footnote" multiline value={block.caption} change={caption => change({ ...block, caption })} /></>;
    }
}

const blockNames: Record<StoryBlock["type"], string> = { heading: "Heading", text: "Text", image: "Image", gallery: "Image gallery", "image-toggle": "Image toggle", video: "Video", button: "Button", cards: "Styled cards" };

export default function ProjectEditor({ initial, projectKey = null }: { initial: ProjectRecord; projectKey?: string | null }) {
    const [data, setData] = useState<ProjectRecord>(() => ({ ...initial, data: { ...initial.data, main: { ...initial.data.main, blocks: storyBlocks(initial) } } }));
    const [saved, setSaved] = useState(() => JSON.stringify({ ...initial, data: { ...initial.data, main: { ...initial.data.main, blocks: storyBlocks(initial) } } }));
    const [key, setKey] = useState(projectKey);
    const [preview, setPreview] = useState(false);
    const [saving, setSaving] = useState(false);
    const [uploads, setUploads] = useState(0);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [undo, setUndo] = useState<StoryBlock[] | null>(null);
    const [cleanupPending, setCleanupPending] = useState<string[]>([]);
    const draftMedia = useRef(new Set<string>());
    const leaving = useRef(false);
    const router = useRouter();
    const dirty = JSON.stringify(data) !== saved || draftMedia.current.size > 0;
    const busy = saving || uploads > 0;
    const blocks = data.data.main.blocks!;
    const trackUpload = useCallback((busy: boolean) => setUploads(count => Math.max(0, count + (busy ? 1 : -1))), []);
    const trackUploadUrl = useCallback((url: string) => { draftMedia.current.add(url); }, []);
    const discardAndNavigate = useCallback(async (href: string) => {
        setSaving(true); setError("");
        try {
            const result = await discardProjectMedia([...new Set([...draftMedia.current, ...cleanupPending])]);
            if (!result.success) { setCleanupPending(result.pending); setError(result.message); return; }
            draftMedia.current.clear(); leaving.current = true;
            router.push(href);
        } catch { setError("Unable to remove unused uploads. Please try again before leaving."); }
        finally { setSaving(false); }
    }, [router, cleanupPending]);
    const retryCleanup = async () => {
        setSaving(true);
        try {
            const currentKeys = new Set(projectMediaUrls(data).map(uploadedMediaKey));
            const deferred = cleanupPending.filter(url => currentKeys.has(uploadedMediaKey(url)));
            deferred.forEach(url => draftMedia.current.add(url));
            const result = await discardProjectMedia(cleanupPending.filter(url => !currentKeys.has(uploadedMediaKey(url))));
            setCleanupPending(result.pending); setError(result.success ? "" : result.message);
            if (result.success) setMessage("Unused files deleted.");
        } catch { setError("Unable to remove unused uploads. Please retry cleanup."); }
        finally { setSaving(false); }
    };
    useEffect(() => {
        if (!dirty && !busy && !cleanupPending.length) return;
        const leave = (event: BeforeUnloadEvent) => { if (!leaving.current) { event.preventDefault(); event.returnValue = ""; } };
        const navigate = (event: MouseEvent) => {
            const anchor = (event.target as Element).closest("a[href]") as HTMLAnchorElement | null;
            if (!anchor || anchor.target === "_blank" || anchor.getAttribute("href")?.startsWith("#") || event.ctrlKey || event.metaKey) return;
            event.preventDefault(); event.stopPropagation();
            if (busy) { setError("Wait for the current upload or save to finish before leaving."); return; }
            if (window.confirm("Leave this page and discard unsaved changes and uploads?")) void discardAndNavigate(anchor.href);
        };
        window.addEventListener("beforeunload", leave); document.addEventListener("click", navigate, true);
        return () => { window.removeEventListener("beforeunload", leave); document.removeEventListener("click", navigate, true); };
    }, [dirty, busy, cleanupPending.length, discardAndNavigate]);
    const field = <K extends keyof ProjectRecord>(key: K, value: ProjectRecord[K]) => { setMessage(""); setData(current => ({ ...current, [key]: value })); };
    const changeBlocks = (update: (blocks: StoryBlock[]) => StoryBlock[]) => { setMessage(""); setData(current => ({ ...current, data: { ...current.data, main: { ...current.data.main, blocks: update(current.data.main.blocks!) } } })); };
    const sidebar = (key: "team" | "skillset" | "approach" | "project-type", value: string) => setData(current => ({ ...current, data: { ...current.data, sidebar: { ...current.data.sidebar, [key]: value.split("\n") } } }));
    const save = async () => {
        setError(""); setMessage("");
        try { validateProject(data); } catch (error) { setError((error as Error).message); return; }
        setSaving(true);
        try {
            const result = await saveProject(key, data, [...new Set([...draftMedia.current, ...cleanupPending])]);
            if (!result.success) { setError(result.message); return; }
            const next = { ...data, revision: result.revision };
            draftMedia.current.clear(); setUndo(null); setCleanupPending(result.cleanupPending);
            setData(next); setSaved(JSON.stringify(next)); setKey(result.projectKey); setMessage("Changes saved.");
            storePendingMedia(result.id, [...new Set([...readPendingMedia(initial.id), ...readPendingMedia(result.id), ...result.cleanupPending])]);
            if (initial.id !== result.id) storePendingMedia(initial.id, []);
            leaving.current = true;
            router.replace(`/case-stories/${result.id}`);
        } catch { setError("Unable to save. Your edits are still here; please try again."); }
        finally { setSaving(false); }
    };
    const toolbar: ReactNode = <div className="editor-toolbar"><div><span className="h4 editor-eyebrow">{key ? "Edit Case Story" : "New Case Story"}</span><p className="m-regular" role="status">{uploads ? "Uploading media…" : message || (dirty ? "Unsaved changes" : key ? "All changes saved" : "Draft · not saved yet")}{data.hidden && " · Hidden from visitors"}</p></div><div className="editor-actions">
        <button className="l-regular admin-button" type="button" disabled={busy} onClick={() => setPreview(!preview)}>{preview ? <AdminIcon name="edit" /> : <Eye />}{preview ? "Keep editing" : "Preview"}</button>
        <button className="l-regular admin-button" type="button" disabled={busy} onClick={() => { if (!dirty || window.confirm("Discard unsaved changes and uploads and return to case stories?")) void discardAndNavigate("/case-stories"); }}>Cancel</button>
        <button className="l-regular admin-button admin-primary" type="button" disabled={busy} onClick={save}>{saving ? "Saving…" : "Save changes"}</button>
    </div></div>;
    return <UploadTrackingContext.Provider value={trackUploadUrl}><PortfolioShell className="portfolio-story portfolio-editor">
        <div className="editor-wrap">{toolbar}{error && <p className="m-regular editor-error" role="alert">{error}</p>}{cleanupPending.length > 0 && <button className="l-regular admin-button" type="button" disabled={busy} onClick={retryCleanup}>Retry file cleanup</button>}</div>
        {preview ? <StoryContent data={data} /> : <form className="editor-wrap editor-form" onSubmit={event => { event.preventDefault(); if (!busy) void save(); }}>
            <fieldset disabled={saving} className="editor-panel"><legend className="h6">Story details</legend>
                <div className="editor-field-grid"><Field label="Title" value={data.name} change={value => field("name", value)} /><Field label="Page URL" value={data.id} change={value => field("id", value)} help="Lowercase letters, numbers and hyphens, e.g. critical-moves" /><Field label="Year" value={data.year} change={value => field("year", value)} /><Field label="Sector" value={data.sector} change={value => field("sector", value)} /><Field label="Domain" value={data.domain} change={value => field("domain", value)} /><Field label="Project types" value={data.data.sidebar["project-type"].join("\n")} change={value => sidebar("project-type", value)} multiline help="One per line" /></div>
                <Field label="Short description" multiline value={data.desc} change={value => field("desc", value)} />
                <div className="editor-field-grid"><label className="m-regular editor-field"><span className="m-regular">Access</span><select className="l-regular" value={data.access} onChange={event => field("access", event.target.value as "member" | "public")}><option className="l-regular" value="public">Public</option><option className="l-regular" value="member">Magic key required</option></select></label><label className="m-regular editor-check"><input type="checkbox" checked={data.hidden} onChange={event => field("hidden", event.target.checked)} />Hide this project from everyone except admins</label></div>
                <details className="editor-details"><summary className="l-regular">Preview image</summary><div className="editor-image-fields">{data.image && safeImage(data.image) && <Image className="editor-image-preview" src={data.image} alt={data.name || "Preview image"} width={420} height={280} />}<MediaUpload onUploaded={url => field("image", url)} onBusy={trackUpload} /><MediaUrlField label="Preview image URL" value={data.image} change={url => field("image", url)} /></div></details>
                <details className="editor-details"><summary className="l-regular">Overview cards</summary><div className="editor-field-grid">{(["team", "skillset", "approach"] as const).map((name, index) => <div className="editor-mini-card" key={name}><Field label={`Overview ${index + 1} label`} value={data.data.sidebar.labels?.[name] || { team: "Team", skillset: "Skillset", approach: "Methods" }[name]} change={value => setData(current => ({ ...current, data: { ...current.data, sidebar: { ...current.data.sidebar, labels: { team: "Team", skillset: "Skillset", approach: "Methods", ...current.data.sidebar.labels, [name]: value } } } }))} /><Field label={`Overview ${index + 1} text`} multiline value={data.data.sidebar[name].join("\n")} change={value => sidebar(name, value)} /></div>)}</div></details>
            </fieldset>
            <div className="editor-section-title"><h2 className="h5">Story content</h2><button className="l-regular admin-button" type="button" disabled={!undo || busy} onClick={() => { if (undo) changeBlocks(() => undo); setUndo(null); }}><Undo2 />Undo removal</button></div>
            <p className="s-regular editor-help">Removed and replaced uploads are deleted when you save, unless another story still uses them.</p>
            {!blocks.length && <p className="l-regular editor-empty">Add your first heading, image or text block below.</p>}
            {blocks.map((block, index) => <fieldset className="editor-panel editor-block" disabled={saving} key={block.id} id={`edit-${block.id}`}><legend className="h6">{index + 1}. {blockNames[block.type]}</legend><div className="editor-block-actions">
                <button className="admin-icon-button" type="button" disabled={index === 0 || busy} aria-label={`Move block ${index + 1} up`} onClick={() => changeBlocks(items => { const next = [...items]; [next[index - 1], next[index]] = [next[index], next[index - 1]]; return next; })}><ArrowUp /></button>
                <button className="admin-icon-button" type="button" disabled={index === blocks.length - 1 || busy} aria-label={`Move block ${index + 1} down`} onClick={() => changeBlocks(items => { const next = [...items]; [next[index + 1], next[index]] = [next[index], next[index + 1]]; return next; })}><ArrowDown /></button>
                <button className="admin-icon-button" type="button" disabled={busy} aria-label={`Remove block ${index + 1}`} onClick={() => { setUndo(blocks); changeBlocks(items => items.filter(item => item.id !== block.id)); }}><AdminIcon name="trash" /></button>
            </div><BlockFields block={block} change={value => changeBlocks(items => items.map(item => item.id === block.id ? value : item))} busy={trackUpload} uploading={uploads > 0} /></fieldset>)}
            <div className="editor-add-block"><h2 className="h5">Add content</h2><div className="editor-actions">{(Object.keys(blockNames) as StoryBlock["type"][]).map(type => <button className="l-regular admin-button" disabled={busy || blocks.length >= 150} type="button" key={type} onClick={() => { const block = newBlock(type); changeBlocks(items => [...items, block]); requestAnimationFrame(() => document.getElementById(`edit-${block.id}`)?.scrollIntoView({ block: "center", behavior: "smooth" })); }}><Plus />{blockNames[type]}</button>)}</div></div>
            <div className="editor-bottom-actions"><button className="l-regular admin-button admin-primary" type="submit" disabled={busy}>{saving ? "Saving…" : "Save changes"}</button></div>
        </form>}
    </PortfolioShell></UploadTrackingContext.Provider>;
}
