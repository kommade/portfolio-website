import { expect, test } from "bun:test";
import { sectionAnchors } from "../lib/section-anchors";

test("heading anchors are readable, unique and avoid page landmarks", () => {
    const sections = ["Research & Findings", "Research & Findings", "Research Findings 2", "Café / Testing", "結果", "!!!", "Page Content"].map((text, index) => ({ id: `internal-${index}`, text }));
    expect([...sectionAnchors(sections).values()]).toEqual(["research-findings", "research-findings-2", "research-findings-2-2", "cafe-testing", "結果", "untitled", "page-content-2"]);
    expect(sectionAnchors([{ id: crypto.randomUUID(), text: "The Challenge" }]).values().next().value).toBe("the-challenge");
});
