import type { Metadata } from 'next';

import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'Borg Dashboard',
  description: 'B2B Dashboard for business clients',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
