import type { Metadata } from 'next';

import { Footer, Header } from '@/components/layout';
import { QueryProvider } from '@/providers/query-provider';

import './globals.css';

export const metadata: Metadata = {
  title: 'job-board Jobs - Find Your Next Career Opportunity',
  description:
    'Discover thousands of job opportunities from top companies across the region.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col antialiased">
        <QueryProvider>
          <Header />
          <div className="flex-1">{children}</div>
          <Footer />
        </QueryProvider>
      </body>
    </html>
  );
}
