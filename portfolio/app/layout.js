import "./globals.css";
import Cursor from "@/components/ui/Cursor";
import { SITE_URL } from '@/lib/siteConfig';
import { Analytics } from "@vercel/analytics/next";

const description =
  'B.Tech CSE (AI/ML) graduate with production-level experience in .NET Full Stack engineering, AI/ML, and Data Analytics. Capgemini alumna. Ships deployed, tested, production-grade code.';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Ananya Shukla | Software Engineer',
    template: '%s | Ananya Shukla',
  },
  description,
  keywords: [
    'Ananya Shukla',
    '.NET Full Stack Developer',
    'ASP.NET Core',
    'Angular Developer',
    'AI ML Engineer',
    'RAG Pipelines',
    'LangChain',
    'Data Analyst',
    'Capgemini',
    'GLA University',
    'Agra India',
    'Full Stack Engineer',
  ],
  authors: [{ name: 'Ananya Shukla', url: SITE_URL }],
  creator: 'Ananya Shukla',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: SITE_URL,
    siteName: 'Ananya Shukla',
    title: 'Ananya Shukla | .NET Full Stack & AI/ML Engineer',
    description,
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Ananya Shukla Portfolio' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ananya Shukla | .NET Full Stack & AI/ML Engineer',
    description,
    images: ['/opengraph-image'],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: SITE_URL },
  icons: {
    icon: [
      { url: '/favicons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicons/favicon.ico', sizes: 'any' },
    ],
    apple: [{ url: '/favicons/apple-touch-icon.png' }],
  },
  manifest: '/favicons/manifest.webmanifest',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Space+Grotesk:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body suppressHydrationWarning className="h-full antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: 'Ananya Shukla',
              url: SITE_URL,
              email: 'ananyashukla0307@gmail.com',
              jobTitle: '.NET Full Stack Engineer',
              sameAs: [
                'https://linkedin.com/in/ananya-shukla26',
                'https://github.com/AnanyaShukla0007',
              ],
            }),
          }}
        />
        <Cursor />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
