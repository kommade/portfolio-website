import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Portfolio Website',
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
                <link rel="manifest" fetchPriority="low" href="/manifest.json"/>
                <meta name="theme-color" content="#FBFBF1" />
                <meta name="description" content="This is a portfolio website designed by Juliette Khoo. This website showcases her work and accomplishments in a visually appealing and user-friendly manner."/>
            </head>
            <body className={inter.className}>{children}</body>
        </html>
    )
}
