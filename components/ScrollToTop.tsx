import { useEffect } from "react";

export default function ScrollToTop() {
    useEffect(() => {
        // Disable browser's default scroll restoration
        if ('scrollRestoration' in history) {
            history.scrollRestoration = 'manual';
        }

        // Handle scroll on pathname change
        window.scrollTo(0, 0);

        // Handle back/forward navigation
        const handleBeforeUnload = () => {
            window.scrollTo(0, 0);
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            // Re-enable default scroll restoration when component unmounts
            if ('scrollRestoration' in history) {
                history.scrollRestoration = 'auto';
            }
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    return null;
}