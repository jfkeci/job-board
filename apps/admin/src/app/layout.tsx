import type { Metadata } from "next";

import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "job-board Admin",
  description: "Admin dashboard for platform management",
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
