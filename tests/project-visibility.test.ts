import { beforeEach, expect, mock, test } from "bun:test";
import { blankProject } from "../lib/project-content";
import React from "react";
let role = "none";
const visible = { name: "Visible", id: "visible", image: "/one.jpg", year: "2026", desc: "" };
const hidden = { name: "Secret", id: "hidden", image: "/secret.jpg", year: "2026", desc: "", hidden: true };
let record = { ...blankProject(), id: "hidden", name: "Secret" };
mock.module("../functions/db", () => ({
    getAllProjects: async () => ["project:1", "project:2"],
    getProjectThumbnail: async (key: string) => ({ success: true, data: key === "project:1" ? visible : hidden }),
    getAllProjectIds: async () => ["visible"],
    getProjectKey: async () => ({ success: true, data: "project:2" }),
    getProjectData: async () => ({ success: true, data: record }),
}));
mock.module("../functions/actions", () => ({ getRole: async () => role }));
mock.module("next/navigation", () => ({ notFound: () => { throw new Error("NOT_FOUND"); } }));
mock.module("../components/CaseStories", () => ({ default: () => null }));
mock.module("../components/PortfolioShell", () => ({ default: () => null }));
mock.module("../components/MagicKeyForm", () => ({ default: () => null }));
mock.module("../app/projects/[id]/page-client", () => ({ ProjectPage: () => null }));
const { default: list } = await import("../app/projects/page");
const { default: detail } = await import("../app/projects/[id]/page");
beforeEach(() => { role = "none"; record = { ...blankProject(), id: "hidden", name: "Secret" }; });

test("server filters hidden titles, images and records before serializing the list", async () => {
    for (const visitor of ["none", "member", "expired"]) {
        role = visitor;
        const page = await list();
        expect(page.props.projects).toEqual([visible]);
        expect(JSON.stringify(page.props)).not.toContain("secret.jpg");
    }
    role = "admin";
    expect((await list()).props.projects).toHaveLength(2);
});

test("hidden direct URLs return not-found for visitors and members", async () => {
    for (const visitor of ["none", "member", "expired"]) {
        role = visitor;
        await expect(detail({ params: Promise.resolve({ id: "hidden" }) })).rejects.toThrow("NOT_FOUND");
    }
    role = "admin";
    const page = await detail({ params: Promise.resolve({ id: "hidden" }) });
    expect(page.props.serverData.name).toBe("Secret");
});

test("magic-key gate still protects visible member stories", async () => {
    record.hidden = false; record.access = "member";
    const page = await detail({ params: Promise.resolve({ id: "hidden" }) });
    expect(page.props.serverData).toBeUndefined();
    role = "member";
    const unlocked = await detail({ params: Promise.resolve({ id: "hidden" }) });
    expect(unlocked.props.serverData.name).toBe("Secret");
});
