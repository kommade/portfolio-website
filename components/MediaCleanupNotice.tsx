"use client";

import { useEffect, useState } from "react";
import { discardProjectMedia } from "@/functions/media-actions";
import { readPendingMedia, storePendingMedia } from "@/lib/pending-media-cleanup";

export default function MediaCleanupNotice({ id }: { id: string }) {
    const [pending, setPending] = useState<string[]>([]);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");
    useEffect(() => { setPending(readPendingMedia(id)); }, [id]);
    if (!pending.length) return null;
    return <div className="story-cleanup-notice" role="status">
        <p className="m-regular">Your story was saved, but some unused uploads still need to be deleted.</p>
        {error && <p className="m-regular editor-error">{error}</p>}
        <button className="l-regular admin-button" disabled={busy} type="button" onClick={async () => {
            setBusy(true); setError("");
            try {
                const result = await discardProjectMedia(pending);
                setPending(result.pending); storePendingMedia(id, result.pending);
                if (!result.success) setError(result.message);
            } catch { setError("Unable to remove unused uploads. Please retry."); }
            finally { setBusy(false); }
        }}>{busy ? "Cleaning up…" : "Retry file cleanup"}</button>
    </div>;
}
