"use client";

import PortfolioShell from "@/components/PortfolioShell";
import MagicKeyForm from "@/components/MagicKeyForm";
import { useSearchParams } from "next/navigation";

export function Login() {
    const searchParams = useSearchParams();
    const redirect = searchParams.get("redirect")

    return (
        <PortfolioShell title="Case Stories" mutedTitle>
            <MagicKeyForm redirect={redirect || "/case-stories"} admin={searchParams.get("mode") === "admin"} />
        </PortfolioShell>
    );
}
