import type { Metadata } from 'next';

import './globals.css';

export const metadata: Metadata = {
  title: 'MP Clone',
  description: 'A Turborepo monorepo project',
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
