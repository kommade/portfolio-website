import PortfolioErrorPage from "@/components/PortfolioErrorPage";

export default function NoAccess() {
    return <PortfolioErrorPage status={403} />;
}
