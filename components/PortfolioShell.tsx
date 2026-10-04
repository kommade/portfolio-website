"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ExternalLink, Lock, MailCheck, SendHorizontal } from "lucide-react";
import type { ReactNode } from "react";
import { portfolioNavigation as navigation, PortfolioNavigation } from "./HeaderComponent";
import ScrollComponent from "./ScrollComponent";

export function DesignIcon({ name }: { name: "arrow" | "send" | "sent" | "external" | "lock" }) {
    const icons = {
        arrow: ArrowRight,
        send: SendHorizontal,
        sent: MailCheck,
        external: ExternalLink,
        lock: Lock,
    };
    const Icon = icons[name];
    return <Icon className={`design-icon design-icon-${name}`} aria-hidden="true" />;
}

export function DesignChip({ children, colour = "sage" }: { children: ReactNode; colour?: "grape" | "brick" | "sage" }) {
    const icon = { grape: "imgEllipse1", sage: "imgEllipse2", brick: "imgEllipse3" }[colour];
    return <span className="s-regular design-chip"><Image src={`/design/1038-2100-${icon}.svg`} width={12} height={12} alt="" />{children}</span>;
}

export default function PortfolioShell({ children, title, mutedTitle = false, className = "", tools }: {
    children: ReactNode; title?: string; mutedTitle?: boolean; className?: string; tools?: ReactNode;
}) {
    return <div className={`portfolio ${className}`}>
        <div className="portfolio-frame">
            <a className="l-regular skip-link" href="#page-content">Skip to content</a>
            <header className="portfolio-header">
                <PortfolioNavigation />
                <div className="portfolio-page-cap" aria-hidden="true" />
            </header>
            <main id="page-content" className="portfolio-content">
                {title && <h1 className={`h2 portfolio-title${mutedTitle ? " is-muted" : ""}`}>{title}</h1>}
                {tools && <div className="portfolio-tools">{tools}</div>}
                {children}
            </main>
            <footer className="portfolio-footer">
                <p className="h6">© 2026 Juliette Khoo<br />Designed and built by Juliette and <a className="h6" href="https://github.com/kommade" target="_blank" rel="noopener noreferrer">Jarrell Khoo</a></p>
                <nav aria-label="Footer navigation">{navigation.map(({ href, label }) => <Link className="text-navigation" key={href} href={href}>{label}</Link>)}</nav>
            </footer>
            <ScrollComponent />
        </div>
    </div>;
}
