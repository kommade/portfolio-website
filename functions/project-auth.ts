import "server-only";
import { getRole } from "./actions";

export async function requireAdmin() {
    if (await getRole() !== "admin") throw new Error("Your admin session has expired. Sign in again before saving.");
}
