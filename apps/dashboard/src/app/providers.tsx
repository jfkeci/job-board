'use client';

import { GlassThemeProvider, brandPresets } from '@borg/ui';

import { AuthProvider } from '@/providers/auth-provider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <GlassThemeProvider brandConfig={brandPresets.indigo} useSystemColorMode>
      <AuthProvider>{children}</AuthProvider>
    </GlassThemeProvider>
  );
}
