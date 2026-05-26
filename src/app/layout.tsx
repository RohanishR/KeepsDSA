import type { Metadata } from 'next';
import { Geist, Geist_Mono, Inter } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'KeepsDSA - Master Data Structures and Algorithms',
    template: '%s | KeepsDSA',
  },
  description: 'A modern platform for tracking, practicing, and mastering Data Structures and Algorithms. Import from LeetCode, save your notes, and build a consistent coding habit.',
  keywords: ['DSA', 'Data Structures', 'Algorithms', 'LeetCode Tracker', 'Coding Practice', 'Software Engineering'],
  authors: [{ name: 'KeepsDSA Team' }],
  creator: 'KeepsDSA',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://keepsdsa.com',
    title: 'KeepsDSA - Master Data Structures and Algorithms',
    description: 'A modern platform for tracking, practicing, and mastering Data Structures and Algorithms.',
    siteName: 'KeepsDSA',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KeepsDSA - Master Data Structures and Algorithms',
    description: 'A modern platform for tracking, practicing, and mastering Data Structures and Algorithms.',
  },
};

import NextAuthSessionProvider from '@/components/providers/SessionProvider';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} antialiased min-h-screen flex flex-col`}
      >
        <NextAuthSessionProvider>
          {children}
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}
