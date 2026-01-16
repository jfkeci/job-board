import type { Metadata } from 'next';

import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'job-board Dashboard',
  description: 'B2B Dashboard for business clients',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
