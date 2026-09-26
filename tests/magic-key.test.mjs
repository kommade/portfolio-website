import { beforeEach, expect, mock, test } from "bun:test";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

let accounts, attempts, cookie;
const redis = {
    incr: async () => ++attempts,
    expire: async () => 1,
    lrange: async () => Object.keys(accounts),
    hgetall: async name => accounts[name],
    del: async () => { attempts = 0; },
};
mock.module("@upstash/redis", () => ({ Redis: { fromEnv: () => redis } }));
mock.module("next/headers", () => ({
    headers: async () => new Headers({ "x-vercel-forwarded-for": "127.0.0.1" }),
    cookies: async () => ({ set: (...args) => { cookie = args; } }),
}));
mock.module("../functions/db", () => ({ logger: () => {} }));
const { loginWithMagicKey } = await import("../functions/actions.ts");
const memberHash = await bcrypt.hash("test-member-key", 4);
const adminHash = await bcrypt.hash("test-admin-password", 4);
beforeEach(() => {
    process.env.SECRET_KEY = "test-only-secret-not-a-real-credential";
    accounts = { reader: { role: "member", hash: memberHash }, owner: { role: "admin", hash: adminHash } };
    attempts = 0; cookie = undefined;
});
const form = value => { const data = new FormData(); if (value !== undefined) data.set("password", value); return data; };
test("existing member password creates a member session", async () => {
    expect(await loginWithMagicKey(form("test-member-key"))).toEqual({ success: true });
    const payload = jwt.verify(cookie[1], process.env.SECRET_KEY);
    expect(payload.role).toBe("member");
    expect(payload.userId).toBe("reader");
    expect(cookie[2].httpOnly).toBe(true);
    expect(cookie[2].sameSite).toBe("strict");
    expect(attempts).toBe(0);
});
test("administrator passwords cannot become magic keys", async () => {
    expect((await loginWithMagicKey(form("test-admin-password"))).success).toBe(false);
    expect(cookie).toBeUndefined();
});
test("unknown keys do not create a session", async () => {
    expect((await loginWithMagicKey(form("wrong-key"))).success).toBe(false);
    expect(cookie).toBeUndefined();
});
test("missing and oversized inputs are rejected before database access", async () => {
    expect((await loginWithMagicKey(form())).success).toBe(false);
    expect((await loginWithMagicKey(form("x".repeat(257)))).success).toBe(false);
    expect(attempts).toBe(0);
});
test("eleventh attempt is limited even with a valid key", async () => {
    attempts = 10;
    const result = await loginWithMagicKey(form("test-member-key"));
    expect(result.success).toBe(false);
    expect(result.message).toContain("15 minutes");
    expect(cookie).toBeUndefined();
});
test("missing user records are ignored", async () => {
    accounts = { deleted: null, reader: { role: "member", hash: memberHash } };
    expect((await loginWithMagicKey(form("test-member-key"))).success).toBe(true);
});
