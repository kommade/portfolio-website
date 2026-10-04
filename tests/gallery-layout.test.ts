import { expect, test } from "bun:test";
import { balancedGalleryRows } from "../lib/gallery-layout";

test("gallery rows prefer equal counts without reordering or dropping images", () => {
    for (let count = 0; count <= 12; count++) {
        const images = Array.from({ length: count }, (_, index) => index);
        const rows = balancedGalleryRows(images);
        expect(rows.flat()).toEqual(images);
        expect(rows.every(row => row.length >= 1 && row.length <= 3)).toBe(true);
        if (count >= 4) expect(rows.every(row => row.length >= 2)).toBe(true);
        if (count > 0 && (count % 2 === 0 || count % 3 === 0)) expect(new Set(rows.map(row => row.length)).size).toBe(1);
    }
    expect(balancedGalleryRows([1, 2, 3, 4, 5]).map(row => row.length)).toEqual([3, 2]);
    expect(balancedGalleryRows([1, 2, 3, 4, 5, 6, 7]).map(row => row.length)).toEqual([3, 2, 2]);
});
