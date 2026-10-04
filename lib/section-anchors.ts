export function sectionAnchors(sections: { id: string; text: string }[]) {
    const used = new Set(["page-content"]);
    return new Map(sections.map(section => {
        const title = section.text.normalize("NFKD").replace(/\p{M}/gu, "").toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-|-$/g, "").slice(0, 80).replace(/-$/, "");
        const base = title || "untitled";
        let anchor = base, suffix = 2;
        while (used.has(anchor)) anchor = `${base}-${suffix++}`;
        used.add(anchor);
        return [section.id, anchor];
    }));
}
