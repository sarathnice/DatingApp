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
  title: 'Mila — Dating for the Indian diaspora',
  description: 'Thoughtful introductions for South Asians building a life in America.',
  openGraph: {
    title: 'Mila — Dating for the Indian diaspora',
    description: 'Someone who gets both worlds. Thoughtful dating for the Indian diaspora.',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Mila — Someone who gets both worlds' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mila — Dating for the Indian diaspora',
    description: 'Someone who gets both worlds. Thoughtful dating for the Indian diaspora.',
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
