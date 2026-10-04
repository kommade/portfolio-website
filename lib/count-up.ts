export function parseCountUpValue(text: string) {
    const match = /^([+-]?)(\d{1,3}(?:,\d{3})+|\d+)(?:\.(\d{1,6}))?(\s*%)?$/.exec(text.trim());
    if (!match) return null;
    const value = Number(`${match[1]}${match[2].replaceAll(",", "")}${match[3] ? `.${match[3]}` : ""}`);
    if (!Number.isFinite(value) || Math.abs(value) > Number.MAX_SAFE_INTEGER) return null;
    return { value, decimalPlaces: match[3]?.length || 0, suffix: match[4] || "", prefix: match[1] === "+" ? "+" : "", useGrouping: match[2].includes(",") };
}
