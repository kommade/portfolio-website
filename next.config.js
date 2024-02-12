/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
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
    }
}

module.exports = nextConfig
