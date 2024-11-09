const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline';
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    block-all-mixed-content;
    upgrade-insecure-requests;
`

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        minimumCacheTTL: 31536000,
        remotePatterns: [
            {
                protocol: "https",
                hostname: "images.unsplash.com",
            },
            {
                protocol: "https",
                hostname: "juliette-portfolio-website.s3.ap-southeast-2.amazonaws.com"
            },
            {
                protocol: "https",
                hostname: "via.placeholder.com"
            }
        ]
    },
    headers: async () => {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'Content-Security-Policy',
                        value: cspHeader.replace(/\n/g, ''),
                    }
                ]
            }
        ]
    },
    experimental: {
        ppr: true,
        dynamicIO: true,
    },
    async rewrites() {
        return [
            {
                source: "/insights/vitals.js",
                destination: "https://cdn.vercel-insights.com/v1/speed-insights/script.js",
            },
            {
                source: "/insights/event.js",
                destination: "https://cdn.vercel-insights.com/v1/script.js",
            }
        ]
    }
}

module.exports = nextConfig
