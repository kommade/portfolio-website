import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: 'https://julittekhoo.com/',
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: 'https://juliettekhoo.com/projects',
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: 'https://juliettekhoo.com/fun-stuff',
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.5,
        },
        {
            url: 'https://juliettekhoo.com/contact',
            lastModified: new Date(),
            changeFrequency: 'never',
            priority: 0.3,
        },
    ]
}