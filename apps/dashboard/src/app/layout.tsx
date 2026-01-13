import type { Metadata } from 'next';

import './globals.css';

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
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
