import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: 'https://juliettekhoo.vercel.app/',
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: 'https://juliettekhoo.vercel.app/case-stories',
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: 'https://juliettekhoo.vercel.app/fun-stuff',
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.5,
        },
        {
            url: 'https://juliettekhoo.vercel.app/contact',
            lastModified: new Date(),
            changeFrequency: 'never',
            priority: 0.3,
        },
    ]
}