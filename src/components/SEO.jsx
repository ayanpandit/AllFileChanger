import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

const DOMAIN = 'https://www.allfilechanger.shop';

export default function SEO({
    title,
    description,
    keywords,
    image = '/og-image.jpg',
    type = 'website',
    schema,
    publishedTime,
    modifiedTime,
    author = 'AllFileChanger'
}) {
    const location = useLocation();
    const canonicalUrl = `${DOMAIN}${location.pathname}`;

    // Default Schema for WebApplication if not provided
    const structuredData = schema || {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": title,
        "url": canonicalUrl,
        "description": description,
        "applicationCategory": "UtilitiesApplication",
        "operatingSystem": "Any",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        },
        "provider": {
            "@type": "Organization",
            "name": "AllFileChanger",
            "url": DOMAIN
        }
    };

    return (
        <Helmet>
            {/* Primary Meta Tags */}
            <title>{title} | AllFileChanger</title>
            <meta name="title" content={`${title} | AllFileChanger`} />
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            <link rel="canonical" href={canonicalUrl} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={canonicalUrl} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={`${DOMAIN}${image}`} />
            <meta property="og:site_name" content="AllFileChanger" />
            {publishedTime && <meta property="article:published_time" content={publishedTime} />}
            {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={canonicalUrl} />
            <meta property="twitter:title" content={title} />
            <meta property="twitter:description" content={description} />
            <meta property="twitter:image" content={`${DOMAIN}${image}`} />

            {/* Technical Tags */}
            <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
            <meta name="language" content="English" />
            <meta name="author" content={author} />

            {/* JSON-LD Structured Data */}
            <script type="application/ld+json">
                {JSON.stringify(structuredData)}
            </script>
        </Helmet>
    );
}
