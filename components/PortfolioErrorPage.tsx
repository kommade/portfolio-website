import Image from "next/image";
import PortfolioShell from "./PortfolioShell";
import notFoundCat from "@/public/images/cat 404.png";
import noAccessCat from "@/public/design/no-access-cat.png";

export default function PortfolioErrorPage({ status }: { status: 403 | 404 }) {
    const missing = status === 404;
    return <PortfolioShell className="portfolio-error">
        <div className="error-state">
            <h1 className="h3 error-title">{missing ? "Page not found" : "You don’t have pawmission to view this page"}</h1>
            <div className={`error-artwork ${missing ? "error-artwork-missing" : "error-artwork-forbidden"}`} aria-hidden="true">
                <Image src={missing ? notFoundCat : noAccessCat} alt="" sizes={missing ? "705px" : "451px"} preload />
            </div>
        </div>
    </PortfolioShell>;
}
