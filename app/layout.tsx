import type { Metadata, Viewport } from 'next'
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import './globals.css'

export const metadata: Metadata = {
    title: 'Juliette Khoo',
    description: 'I’m a dreamer and a UX designer, currently based in Singapore. Here’s some of my work!',
    keywords: 'architecture,illustration,design,portfolio',
    twitter: {
        card: 'summary_large_image',
        images: [
            {
                url: '/images/about-me.jpg',
                width: 800,
                height: 600,
            },
        
        ],
        title: 'Juliette Khoo - architecture student and illustration enthusiast',
        description: 'I’m a dreamer and a UX designer, currently based in Singapore. Here’s some of my work!',
    },
    openGraph: {
        url: 'https://juliettekhoo.com/',
        title: 'Juliette Khoo - architecture student and illustration enthusiast',
        description: 'I’m a dreamer and a UX designer, currently based in Singapore. Here’s some of my work!',
        images: [
            {
                url: '/images/about-me.jpg',
                width: 800,
                height: 600,
            },
        ],
    },
    metadataBase: new URL("https://juliettekhoo.com/"),
}

export const viewport: Viewport = {
    themeColor: 'FBFBF1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
    return (
        <html lang="en">
            <head>
                <link rel="preconnect" fetchPriority="high" href="juliette-portfolio-website.s3.ap-southeast-2.amazonaws.com" crossOrigin="use-credentials" />
            </head>
            <body>
                {children}
                <Analytics />
                <SpeedInsights />
            </body>
        </html>
    )
}
