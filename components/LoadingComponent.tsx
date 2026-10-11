import Image from "next/image";
import PortfolioShell from "./PortfolioShell";

const LoadingComponent = () => {
    return (
        <PortfolioShell className="portfolio-loading">
            <div className="loading-state" role="status" aria-live="polite">
                <div className="loading-mark" aria-hidden="true">
                    <div className="loading-chain-position">
                        <div className="loading-chain">
                            <Image className="loading-chain-image" src="/design/loading-chain.svg" width={418} height={27.3333} alt="" preload />
                        </div>
                    </div>
                </div>
                <h4 className="loading-title">Loading...</h4>
            </div>
        </PortfolioShell>
    )
}

export default LoadingComponent
