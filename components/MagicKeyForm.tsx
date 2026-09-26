"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { login, loginWithMagicKey } from "@/functions/actions";
import { DesignIcon } from "./PortfolioShell";

export default function MagicKeyForm({ redirect = "/projects", admin = false }: { redirect?: string; admin?: boolean }) {
    const router = useRouter();
    const [pending, setPending] = useState(false);
    const [error, setError] = useState("");
    return <form className="key-form" aria-busy={pending} onSubmit={async event => {
        event.preventDefault();
        if (pending) return;
        const data = new FormData(event.currentTarget);
        setPending(true); setError("");
        try {
            const result = await (admin ? login(data) : loginWithMagicKey(data));
            if (result.success) {
                router.replace(redirect.startsWith("/") && !redirect.startsWith("//") && !redirect.includes("\\") ? redirect : "/projects");
                router.refresh();
            } else setError(result.message || "That key didn’t work. Please try again.");
        } catch { setError("Unable to sign in right now. Please try again."); }
        finally { setPending(false); }
    }}>
        <div className="key-intro"><DesignIcon name="lock" /><p>{admin ? "Sign in to manage your portfolio." : "Sorry, you’ll need the magic key to access this."}</p></div>
        {admin && <label>Username<input name="username" autoComplete="username" required /></label>}
        <div className="key-input-row">
            <input name="password" type="password" autoComplete="current-password" aria-label={admin ? "Password" : "Magic key"} placeholder={admin ? "Password" : "Enter magic key here…"} required maxLength={256} />
            <button className="design-button" aria-label="Unlock case stories" type="submit" disabled={pending}><DesignIcon name="arrow" /></button>
        </div>
        {error && <p className="form-error" role="alert">{error}</p>}
        {admin && <Link href="/login">Use a magic key instead</Link>}
    </form>;
}
