import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://mila-nri-dating.sarathnice.chatgpt.site'),
  title: 'Mila — Meet with more meaning',
  description: 'A worldwide, values-first dating app with explainable matching and thoughtful AI.',
  openGraph: {
    title: 'Mila — Meet with more meaning',
    description: 'A worldwide dating experience with safer conversations and thoughtful AI.',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Mila — Meet with more meaning' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mila — Meet with more meaning',
    description: 'A worldwide dating experience with safer conversations and thoughtful AI.',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
