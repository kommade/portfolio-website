"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { FilePlus, Pencil, Trash2 } from "lucide-react";

export function AdminIcon({ name }: { name: "new-page" | "edit" | "trash" }) {
    const Icon = { "new-page": FilePlus, edit: Pencil, trash: Trash2 }[name];
    return <Icon className="admin-icon" aria-hidden="true" />;
}

export function ConfirmDialog({ title, children, confirm, close, busy = false, action = "Delete" }: { title: string; children: ReactNode; confirm: () => void; close: () => void; busy?: boolean; action?: string }) {
    const ref = useRef<HTMLDialogElement>(null);
    useEffect(() => { const element = ref.current!; const focus = document.activeElement as HTMLElement; element.showModal(); return () => { element.close(); focus?.focus(); }; }, []);
    return <dialog className="editor-dialog" ref={ref} aria-labelledby="confirmation-title" onCancel={event => { event.preventDefault(); if (!busy) close(); }}>
        <h2 className="h4" id="confirmation-title">{title}</h2><div>{children}</div><div className="editor-actions"><button type="button" autoFocus className="l-regular admin-button" disabled={busy} onClick={close}>Cancel</button><button type="button" className="l-regular admin-button admin-danger" disabled={busy} onClick={confirm}>{busy ? "Please wait…" : action}</button></div>
    </dialog>;
}
