import { expect, test } from "bun:test";
import { parseCountUpValue } from "../lib/count-up";
import { blankProject, storyBlocks, validateProject } from "../lib/project-content";

test("count-up values retain percentages, precision, signs and grouping", () => {
    expect(parseCountUpValue("99.10%")).toEqual({ value: 99.1, decimalPlaces: 2, suffix: "%", prefix: "", useGrouping: false });
    expect(parseCountUpValue(" +1,250 ")).toEqual({ value: 1250, decimalPlaces: 0, suffix: "", prefix: "+", useGrouping: true });
    expect(parseCountUpValue("-12.5 %")?.value).toBe(-12.5);
    expect(parseCountUpValue("0")?.value).toBe(0);
    for (const text of ["", "Better results", "99% users", "1,2", "Infinity", "1e3", "9007199254740992", "1.1234567"]) expect(parseCountUpValue(text)).toBeNull();
});

test("count-up is optional for existing cards and validates before saving", () => {
    const project = { ...blankProject(), id: "count-up", name: "Count up" };
    const card = { id: "one", value: "99.1%", text: "Satisfaction", colour: "purple" as const, countUp: true };
    project.data.main.blocks = [{ id: "cards", type: "cards", cards: [card], caption: "" }];
    const saved = JSON.parse(JSON.stringify(project));
    expect(() => validateProject(saved)).not.toThrow();
    expect(storyBlocks(saved)).toEqual(project.data.main.blocks!);
    card.value = "More satisfied";
    expect(() => validateProject(project)).toThrow("number or percentage");
    card.countUp = false;
    expect(() => validateProject(project)).not.toThrow();
    delete (card as { countUp?: boolean }).countUp;
    expect(() => validateProject(project)).not.toThrow();
    saved.data.main.blocks[0].cards[0].countUp = "true";
    expect(() => validateProject(saved)).toThrow("Invalid card");
});
