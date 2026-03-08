import type { Metadata } from 'next';
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
  metadataBase: new URL('https://nookme.xyz'),
  openGraph: {
    title: 'NookMe | Your Shared Content Space',
    description:
      'Turn every shared link into a content card with its own thread. Stop losing great content in endless chat scrolls.',
    url: 'https://nookme.xyz',
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
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
