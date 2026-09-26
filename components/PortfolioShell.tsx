"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { portfolioNavigation as navigation, PortfolioNavigation } from "./HeaderComponent";

export function DesignIcon({ name }: { name: "arrow" | "send" | "sent" | "external" | "lock" }) {
    const sources = {
        arrow: "1038-2100-imgLucideIcons",
        send: "1050-2838-imgLucideIcons1",
        sent: "1050-2838-imgLucideIcons",
        external: "1050-2838-imgExternalLink1",
        lock: "1038-2621-imgIconLock",
    };
    // Preserve the exported SVG's intrinsic dimensions.
    return <img className="design-icon" src={`/design/${sources[name]}.svg`} alt="" aria-hidden="true" />;
}

export function DesignChip({ children, colour = "sage" }: { children: ReactNode; colour?: "grape" | "brick" | "sage" }) {
    const icon = { grape: "imgEllipse1", sage: "imgEllipse2", brick: "imgEllipse3" }[colour];
    return <span className="design-chip"><img src={`/design/1038-2100-${icon}.svg`} alt="" />{children}</span>;
}

export default function PortfolioShell({ children, title, mutedTitle = false, className = "", tools }: {
    children: ReactNode; title?: string; mutedTitle?: boolean; className?: string; tools?: ReactNode;
}) {
    return <div className={`portfolio ${className}`}>
        <div className="portfolio-frame">
            <a className="skip-link" href="#page-content">Skip to content</a>
            <header className="portfolio-header">
                <PortfolioNavigation />
            </header>
            <main id="page-content" className="portfolio-content">
                {title && <h1 className={`portfolio-title${mutedTitle ? " is-muted" : ""}`}>{title}</h1>}
                {tools && <div className="portfolio-tools">{tools}</div>}
                {children}
            </main>
            <footer className="portfolio-footer">
                <p>© 2026 Juliette Khoo<br />Designed and built by Juliette and <a href="https://github.com/kommade" target="_blank" rel="noopener noreferrer">Jarrell Khoo</a></p>
                <nav aria-label="Footer navigation">{navigation.map(({ href, label }) => <Link key={href} href={href}>{label}</Link>)}</nav>
            </footer>
        </div>
    </div>;
}
