'use client';

import { GlassThemeProvider, brandPresets } from '@borg/ui';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <GlassThemeProvider brandConfig={brandPresets.indigo} useSystemColorMode>
      {children}
    </GlassThemeProvider>
  );
}
