import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  title: 'NookMe | Your Shared Content Space',
  description:
    'NookMe turns every shared link into a content card with its own thread. Stop losing great content in endless chat scrolls.',
  manifest: '/manifest.json',
  openGraph: {
    title: 'NookMe | Your Shared Content Space',
    description:
      'Turn every shared link into a content card with its own thread. Stop losing great content in endless chat scrolls.',
    siteName: 'NookMe',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'NookMe - Your Shared Content Space',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NookMe | Your Shared Content Space',
    description:
      'Turn every shared link into a content card with its own thread.',
    images: ['/og-image.png'],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'NookMe',
  },
};

export const viewport: Viewport = {
  themeColor: '#007AFF',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body className={inter.className}>
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js').catch(() => {});
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
