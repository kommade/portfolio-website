export function balancedGalleryRows<T>(images: T[]): T[][] {
    const count = images.length;
    if (!count) return [];
    const rows = count <= 3 ? 1 : count % 3 === 0 ? count / 3 : count % 2 === 0 ? count / 2 : Math.ceil(count / 3);
    const result: T[][] = [];
    let offset = 0;
    for (let row = 0; row < rows; row++) {
        const size = Math.ceil((count - offset) / (rows - row));
        result.push(images.slice(offset, offset + size));
        offset += size;
    }
    return result;
}
