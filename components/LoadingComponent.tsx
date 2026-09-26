import PortfolioShell from "./PortfolioShell";

const LoadingComponent = () => {
    return (
        <PortfolioShell className="portfolio-loading">
            <div className="loading-state" role="status" aria-live="polite">
                <div className="loading-mark" aria-hidden="true"><span /><span /><span /></div>
                <h1 className="loading-title">Almost there…</h1>
                <p>Loading the page. Just a moment.</p>
            </div>
        </PortfolioShell>
    )
}

export default LoadingComponent
