---
title: Chakra UI Glassmorphism Design System Package
id: 04-chakra-ui-design-system
created: 2026-01-13
updated: 2026-01-13
status: executed
executed_date: 2026-01-13
execution_result: success
deprecated: false
deprecated_reason:
target: frontend
complexity: moderate
tags:
  - design-system
  - chakra-ui
  - glassmorphism
  - shared-package
  - ui-components
  - theming
  - brand-customization
dependencies:
  - 01-turborepo-monorepo-setup
blocks: []
related_specs: []
related_planning: []
notes: Successfully created @borg/ui package with glassmorphism theme, brand color customization, and pre-built Glass components. Package builds successfully and exports all components, utilities, and types.
---

# 04 - Chakra UI Glassmorphism Design System Package

**Date**: 2026-01-13
**Target**: Frontend
**Related Spec**: N/A

---

## Context

The project requires a shared design system package that provides consistent UI components, theming, and styling across all Next.js frontend applications in the Turborepo monorepo. The design system will be built on top of Chakra UI and feature a **glassmorphism** aesthetic - characterized by frosted glass effects, transparency, blur backgrounds, subtle borders, and modern depth.

## Goal

Create a reusable `@mp/ui` (or similar namespace) design system package that:
1. Extends Chakra UI with a custom glassmorphism theme
2. Provides pre-built glassmorphic components
3. Can be imported and used by any Next.js app in the monorepo
4. Ensures visual consistency across all frontend applications
5. **Supports customizable primary colors per application** for brand differentiation

## Current State

- Turborepo monorepo is set up with `packages/` directory for shared code
- Next.js frontend applications exist (or will exist) in `apps/` directory
- No shared UI/design system package currently exists
- Chakra UI is the chosen component library

## Requirements

### 1. Package Setup

- Create package at `packages/ui/` with proper TypeScript configuration
- Package name: `@mp/ui` (adjust namespace to match project convention)
- Set up proper exports for tree-shaking support
- Configure as an internal Turborepo package
- Include peer dependencies for Chakra UI and React

### 2. Brand/Color Customization System

Each application must be able to define its own primary color palette while sharing the same glassmorphism foundation:

- **BrandConfig Interface**:
  ```typescript
  interface BrandConfig {
    primary: string;      // Primary brand color (e.g., '#6366f1')
    secondary?: string;   // Optional secondary color
    accent?: string;      // Optional accent color
    // Generates full color scale (50-900) from primary
  }
  ```

- **Color Scale Generation**:
  - Auto-generate a full Chakra color scale (50, 100, 200... 900) from a single primary color
  - Support both light and dark mode variants
  - Ensure accessible contrast ratios are maintained

- **Preset Brand Palettes**:
  - Provide preset color palettes for common use cases (e.g., `brandPresets.indigo`, `brandPresets.emerald`, `brandPresets.rose`)
  - Allow full custom colors via hex/rgb values

- **Runtime Theme Switching** (Optional):
  - Support switching brand colors at runtime if needed
  - Useful for white-label scenarios or user preferences

### 3. Glassmorphism Theme

Create a custom Chakra UI theme with glassmorphism characteristics:

- **Colors**:
  - Semi-transparent backgrounds (rgba with alpha values)
  - Subtle gradient overlays
  - Frosted/muted color palette
  - Light and dark mode support
  - **Primary color integration** with glass effects (tinted glass based on brand color)

- **Effects**:
  - `backdropFilter: blur()` for frosted glass effect
  - Subtle box shadows for depth
  - Semi-transparent borders (1px solid rgba)
  - Gradient backgrounds where appropriate

- **Typography**:
  - Clean, modern font stack (Inter, system fonts fallback)
  - Appropriate contrast ratios for readability on glass backgrounds

- **Spacing & Radius**:
  - Consistent border-radius (rounded corners typical of glassmorphism)
  - Comfortable padding for glass panels

### 4. Core Components

Create glassmorphic versions of common components:

- **GlassCard**: Container with frosted glass effect
- **GlassButton**: Button variants with glass styling
- **GlassInput**: Form inputs with glass aesthetic
- **GlassModal**: Modal/dialog with backdrop blur
- **GlassNavbar**: Navigation bar component
- **GlassSidebar**: Sidebar navigation component
- **GlassPanel**: Generic glass panel container
- **GlassTooltip**: Tooltip with glass effect

### 5. Theme Provider & Utilities

- **GlassThemeProvider**: Wrapper component that applies the glassmorphism theme
  - Accepts `brandConfig` prop for per-app customization
  - Merges brand colors with base glass theme
- **createGlassTheme(brandConfig)**: Factory function to generate themed instance
- **useGlassStyles**: Hook for applying glass effects to custom components
- **useBrandColors**: Hook to access current brand color palette
- **glassLayerStyles**: Pre-defined layer styles for common glass effects
- **Color mode support**: Seamless light/dark mode switching with brand colors

### 6. Package Exports

Structure exports for easy consumption:

```typescript
// Theme & Brand
export { glassTheme, createGlassTheme } from './theme';
export { GlassThemeProvider } from './provider';
export { brandPresets } from './brand';

// Components
export { GlassCard } from './components/GlassCard';
export { GlassButton } from './components/GlassButton';
// ... etc

// Utilities
export { useGlassStyles, useBrandColors, glassLayerStyles } from './utils';
export { generateColorScale } from './utils/colorScale';

// Types
export type {
  BrandConfig,
  GlassThemeConfig,
  GlassCardProps,
  GlassButtonProps
} from './types';
```

## Constraints

- Must be compatible with Chakra UI v2.x (or latest stable)
- Must work with Next.js 14+ (App Router compatible)
- Must support both light and dark color modes
- Must maintain accessibility standards (WCAG 2.1 AA)
- Must not include hardcoded application-specific logic
- Should avoid large bundle size - leverage Chakra's existing primitives

## Expected Output

- [ ] `packages/ui/` directory created with package structure
- [ ] `package.json` with proper dependencies and exports
- [ ] `tsconfig.json` configured for the package
- [ ] Custom glassmorphism theme (`src/theme/`)
- [ ] Brand configuration system (`src/brand/`)
- [ ] Color scale generation utility (`src/utils/colorScale.ts`)
- [ ] Glass components (`src/components/`)
- [ ] Theme provider with brand support (`src/provider/`)
- [ ] Type definitions including BrandConfig (`src/types/`)
- [ ] Main entry point with exports (`src/index.ts`)
- [ ] README with usage documentation including brand customization examples

## Acceptance Criteria

- [ ] Package builds without errors
- [ ] Package can be imported in a Next.js app: `import { GlassCard, GlassThemeProvider } from '@mp/ui'`
- [ ] Theme applies glassmorphism styling correctly
- [ ] Components render with frosted glass appearance
- [ ] **Different apps can use different primary colors** via `brandConfig` prop
- [ ] **Color scale is auto-generated** from a single primary color value
- [ ] **Brand presets work correctly** (e.g., `brandPresets.indigo`)
- [ ] Components respect the configured brand colors (buttons, links, focus states, etc.)
- [ ] Light/dark mode switching works properly with brand colors
- [ ] TypeScript types are properly exported
- [ ] No peer dependency warnings when installed

## Technical Notes

### Glassmorphism CSS Properties

Key CSS properties for the glass effect:
```css
/* Core glass effect */
background: rgba(255, 255, 255, 0.1);
backdrop-filter: blur(10px);
-webkit-backdrop-filter: blur(10px);
border: 1px solid rgba(255, 255, 255, 0.2);
border-radius: 16px;
box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
```

### Chakra UI Theme Extension with Brand Colors

```typescript
import { extendTheme } from '@chakra-ui/react';
import { generateColorScale } from './utils/colorScale';

function createGlassTheme(brandConfig: BrandConfig) {
  const primaryScale = generateColorScale(brandConfig.primary);

  return extendTheme({
    colors: {
      primary: primaryScale,  // primary.50, primary.100, ... primary.900
      brand: primaryScale,    // Alias for convenience
    },
    styles: {
      global: {
        // Global styles
      },
    },
    components: {
      Button: {
        defaultProps: {
          colorScheme: 'primary',
        },
      },
      // Other component overrides
    },
    layerStyles: {
      glass: {
        bg: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: 'xl',
      },
      glassPrimary: {
        bg: `${primaryScale[500]}15`,  // Primary color with low opacity
        backdropFilter: 'blur(10px)',
        border: `1px solid ${primaryScale[300]}30`,
        borderRadius: 'xl',
      },
    },
  });
}
```

### Color Scale Generation

```typescript
// Utility to generate a full color scale from a single hex color
// Uses color manipulation (HSL adjustments) to create lighter/darker variants

function generateColorScale(baseColor: string): Record<string, string> {
  // Returns: { 50: '#...', 100: '#...', ..., 900: '#...' }
  // 500 is typically the base color
  // 50-400 are progressively lighter
  // 600-900 are progressively darker
}
```

Consider using libraries like `color`, `chroma-js`, or `polished` for color manipulation.

### Browser Compatibility Note

`backdrop-filter` has good modern browser support but may need fallbacks for older browsers. Consider graceful degradation with solid semi-transparent backgrounds.

## Files to Create

```
packages/
  ui/
    package.json
    tsconfig.json
    README.md
    src/
      index.ts
      theme/
        index.ts
        createGlassTheme.ts      # Factory function for themed instances
        foundations/
          colors.ts
          typography.ts
          shadows.ts
          blur.ts
        components/
          button.ts
          card.ts
          input.ts
          modal.ts
        layerStyles.ts
      brand/
        index.ts
        presets.ts               # Pre-defined brand color palettes
        types.ts                 # BrandConfig interface
      components/
        GlassCard.tsx
        GlassButton.tsx
        GlassInput.tsx
        GlassModal.tsx
        GlassNavbar.tsx
        GlassSidebar.tsx
        GlassPanel.tsx
        index.ts
      provider/
        GlassThemeProvider.tsx   # Accepts brandConfig prop
        index.ts
      utils/
        useGlassStyles.ts
        useBrandColors.ts        # Hook to access brand colors
        colorScale.ts            # Generate color scale from single color
        index.ts
      types/
        index.ts
```

## Example/Reference

### Usage in Different Apps with Different Brand Colors

```tsx
// ========================================
// App 1: Main Web App (Indigo brand)
// ========================================
// apps/web/app/layout.tsx
import { GlassThemeProvider, brandPresets } from '@mp/ui';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <GlassThemeProvider brandConfig={brandPresets.indigo}>
          {children}
        </GlassThemeProvider>
      </body>
    </html>
  );
}

// ========================================
// App 2: Admin Dashboard (Emerald brand)
// ========================================
// apps/admin/app/layout.tsx
import { GlassThemeProvider, brandPresets } from '@mp/ui';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <GlassThemeProvider brandConfig={brandPresets.emerald}>
          {children}
        </GlassThemeProvider>
      </body>
    </html>
  );
}

// ========================================
// App 3: Custom Brand Color
// ========================================
// apps/partner-portal/app/layout.tsx
import { GlassThemeProvider } from '@mp/ui';

const partnerBrand = {
  primary: '#e11d48',    // Rose/pink
  secondary: '#0ea5e9',  // Sky blue accent
};

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <GlassThemeProvider brandConfig={partnerBrand}>
          {children}
        </GlassThemeProvider>
      </body>
    </html>
  );
}
```

### Component Usage (Same Across All Apps)

```tsx
// Works the same in all apps - colors adapt to brand
import { GlassCard, GlassButton } from '@mp/ui';

export default function Dashboard() {
  return (
    <GlassCard>
      <h1>Welcome</h1>
      {/* Button uses the app's configured primary color */}
      <GlassButton colorScheme="primary">Get Started</GlassButton>
      <GlassButton variant="outline">Learn More</GlassButton>
    </GlassCard>
  );
}
```

### Using the Brand Colors Hook

```tsx
import { useBrandColors } from '@mp/ui';

function CustomComponent() {
  const { primary, secondary, colorScale } = useBrandColors();

  return (
    <div style={{
      borderColor: colorScale[500],
      backgroundColor: colorScale[50]
    }}>
      Custom branded component
    </div>
  );
}
```

### Programmatic Theme Creation

```tsx
import { createGlassTheme } from '@mp/ui';

// Create a theme instance for SSR or testing
const customTheme = createGlassTheme({
  primary: '#8b5cf6',  // Violet
});
```

### Visual Reference

Glassmorphism characteristics to achieve:
- Frosted glass appearance with content visible but blurred behind
- Subtle light borders that catch light
- Soft shadows for depth without harsh edges
- Transparency that adapts to underlying content
- Modern, clean, and minimal aesthetic
- **Primary color tints** applied to glass surfaces for brand identity

---

## Related

- Depends on: [[prompts/01-turborepo-monorepo-setup]]
- Blocks: Future frontend application prompts
- References: Chakra UI documentation, glassmorphism.com for design inspiration
