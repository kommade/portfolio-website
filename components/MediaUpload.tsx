"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { createMediaUpload } from "@/functions/media-actions";
import { validateMedia, type MediaKind } from "@/lib/media";

export const UploadTrackingContext = createContext<(url: string) => void>(() => {});

export default function MediaUpload({ kind = "image", onUploaded, onBusy }: { kind?: MediaKind; onUploaded: (url: string) => void; onBusy: (busy: boolean) => void }) {
    const [progress, setProgress] = useState<number | null>(null);
    const [error, setError] = useState("");
    const trackUpload = useContext(UploadTrackingContext);
    const request = useRef<XMLHttpRequest | null>(null);
    const uploaded = useRef(onUploaded);
    uploaded.current = onUploaded;
    useEffect(() => () => request.current?.abort(), []);
    const upload = async (file: File) => {
        setError("");
        const type = kind === "subtitles" && file.name.toLowerCase().endsWith(".vtt") ? "text/vtt" : file.type;
        try { validateMedia(kind, type, file.size); } catch (error) { setError((error as Error).message); return; }
        onBusy(true); setProgress(0);
        try {
            const signed = await createMediaUpload(kind, type, file.size);
            if (!signed.success) throw new Error(signed.message);
            trackUpload(signed.publicUrl);
            const form = new FormData();
            Object.entries(signed.fields).forEach(([key, value]) => form.append(key, value));
            form.append("file", file);
            await new Promise<void>((resolve, reject) => {
                const xhr = new XMLHttpRequest(); request.current = xhr;
                xhr.open("POST", signed.url);
                xhr.upload.onprogress = event => { if (event.lengthComputable) setProgress(Math.round(event.loaded / event.total * 100)); };
                xhr.onload = () => xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error("Upload failed. Check the file and try again."));
                xhr.onerror = () => reject(new Error("Upload could not connect. Check your connection and the site's upload configuration, then try again."));
                xhr.onabort = () => reject(new Error("Upload cancelled."));
                xhr.send(form);
            });
            uploaded.current(signed.publicUrl);
        } catch (error) { setError(error instanceof Error ? error.message : "Upload failed. Please try again."); }
        finally { request.current = null; setProgress(null); onBusy(false); }
    };
    return <div className="editor-upload"><label className="l-regular admin-button">{progress === null ? `Upload ${kind === "subtitles" ? "captions" : kind}` : `Uploading ${progress}%`}<input className="editor-file-input" type="file" disabled={progress !== null} accept={kind === "video" ? "video/mp4,video/webm" : kind === "subtitles" ? ".vtt,text/vtt" : "image/jpeg,image/png,image/webp,image/gif,image/avif"} onChange={event => { const file = event.target.files?.[0]; if (file) void upload(file); event.target.value = ""; }} /></label>
        {progress !== null && <><progress value={progress} max={100} aria-label="Upload progress" /><button className="l-regular admin-button" type="button" onClick={() => request.current?.abort()} disabled={!request.current}>Cancel upload</button></>}
        <span className="s-regular editor-help">{kind === "video" ? "MP4 or WebM · up to 250 MB" : kind === "subtitles" ? "WebVTT · up to 1 MB" : "JPG, PNG, WebP, GIF or AVIF · up to 20 MB"}</span>
        {error && <p className="m-regular editor-error" role="alert">{error}</p>}
    </div>;
}
