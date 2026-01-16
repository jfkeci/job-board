# @job-board/ui

A glassmorphism design system built on Chakra UI with support for customizable brand colors.

## Features

- Glassmorphism styling with frosted glass effects
- Customizable primary colors per application
- Pre-built brand color presets
- Light/dark mode support
- TypeScript support with full type definitions
- Tree-shakeable exports

## Installation

```bash
pnpm add @job-board/ui
```

### Peer Dependencies

```bash
pnpm add @chakra-ui/react @emotion/react @emotion/styled framer-motion
```

## Quick Start

### Basic Setup

```tsx
// app/layout.tsx
import { GlassThemeProvider } from '@job-board/ui';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <GlassThemeProvider>
          {children}
        </GlassThemeProvider>
      </body>
    </html>
  );
}
```

### Using Components

```tsx
import { GlassCard, GlassButton, GlassInput, Box, Heading, VStack } from '@job-board/ui';

export default function LoginForm() {
  return (
    <GlassCard maxW="400px" mx="auto" mt={8}>
      <VStack spacing={4}>
        <Heading size="lg">Sign In</Heading>
        <GlassInput placeholder="Email" type="email" />
        <GlassInput placeholder="Password" type="password" />
        <GlassButton w="full">Sign In</GlassButton>
      </VStack>
    </GlassCard>
  );
}
```

## Brand Customization

### Using Brand Presets

```tsx
import { GlassThemeProvider, brandPresets } from '@job-board/ui';

// Main app with indigo theme
<GlassThemeProvider brandConfig={brandPresets.indigo}>
  <App />
</GlassThemeProvider>

// Admin app with emerald theme
<GlassThemeProvider brandConfig={brandPresets.emerald}>
  <AdminApp />
</GlassThemeProvider>
```

### Available Presets

| Preset   | Primary Color | Description                       |
| -------- | ------------- | --------------------------------- |
| `indigo` | `#6366f1`     | Professional, trustworthy         |
| `emerald`| `#10b981`     | Growth, success, health           |
| `rose`   | `#f43f5e`     | Bold, energetic, creative         |
| `blue`   | `#3b82f6`     | Classic, reliable, corporate      |
| `violet` | `#8b5cf6`     | Creative, luxurious, innovative   |
| `amber`  | `#f59e0b`     | Warm, friendly, optimistic        |
| `cyan`   | `#06b6d4`     | Tech, modern, fresh               |
| `slate`  | `#64748b`     | Neutral, minimal, professional    |

### Custom Brand Colors

```tsx
import { GlassThemeProvider } from '@job-board/ui';

const customBrand = {
  primary: '#e11d48',    // Rose/pink
  secondary: '#0ea5e9',  // Sky blue
  accent: '#8b5cf6',     // Violet
};

<GlassThemeProvider brandConfig={customBrand}>
  <App />
</GlassThemeProvider>
```

### Accessing Brand Colors

```tsx
import { useBrandColors } from '@job-board/ui';

function BrandedComponent() {
  const { primary, primaryScale } = useBrandColors();

  return (
    <Box
      bg={primaryScale[50]}
      borderColor={primaryScale[500]}
      borderWidth={1}
      p={4}
    >
      Primary color: {primary}
    </Box>
  );
}
```

## Components

### GlassCard

```tsx
<GlassCard>Basic card</GlassCard>
<GlassCard interactive>Hover effects</GlassCard>
<GlassCard primaryTint>Brand tinted</GlassCard>
```

### GlassButton

```tsx
<GlassButton>Solid (default)</GlassButton>
<GlassButton variant="glass">Glass effect</GlassButton>
<GlassButton variant="glassPrimary">Primary glass</GlassButton>
<GlassButton variant="outline">Outline</GlassButton>
<GlassButton variant="ghost">Ghost</GlassButton>
```

### GlassInput

```tsx
<GlassInput placeholder="Default glass" />
<GlassInput variant="glassFilled" placeholder="Filled glass" />
<GlassTextarea placeholder="Multiline input" />
<GlassSelect>
  <option>Option 1</option>
</GlassSelect>
```

### GlassModal

```tsx
<GlassModal isOpen={isOpen} onClose={onClose}>
  <GlassModalOverlay />
  <GlassModalContent>
    <GlassModalHeader>Title</GlassModalHeader>
    <GlassModalCloseButton />
    <GlassModalBody>Content</GlassModalBody>
    <GlassModalFooter>
      <GlassButton onClick={onClose}>Close</GlassButton>
    </GlassModalFooter>
  </GlassModalContent>
</GlassModal>
```

### GlassNavbar

```tsx
<GlassNavbar sticky>
  <Box>Logo</Box>
  <HStack>
    <GlassNavbarItem active>Home</GlassNavbarItem>
    <GlassNavbarItem>About</GlassNavbarItem>
  </HStack>
  <GlassButton size="sm">Sign In</GlassButton>
</GlassNavbar>
```

### GlassSidebar

```tsx
<GlassSidebar width="240px">
  <GlassSidebarSection title="Navigation">
    <GlassSidebarItem icon={<HomeIcon />} active>
      Dashboard
    </GlassSidebarItem>
    <GlassSidebarItem icon={<UsersIcon />}>
      Users
    </GlassSidebarItem>
  </GlassSidebarSection>
</GlassSidebar>
```

### GlassPanel

```tsx
<GlassPanel p={6}>Default panel</GlassPanel>
<GlassPanel intensity="light">Subtle effect</GlassPanel>
<GlassPanel intensity="heavy">Heavy blur</GlassPanel>
<GlassPanel primaryTint>Brand tinted</GlassPanel>
<GlassPanel interactive>With hover</GlassPanel>
```

## Utilities

### useGlassStyles

Create custom glass effects:

```tsx
import { useGlassStyles } from '@job-board/ui';

function CustomGlass() {
  const { styles } = useGlassStyles({
    blur: 12,
    opacity: 0.15,
    borderOpacity: 0.25,
    borderRadius: '1.5rem',
  });

  return <Box sx={styles}>Custom glass element</Box>;
}
```

### generateColorScale

Generate a full color scale from a single color:

```tsx
import { generateColorScale } from '@job-board/ui';

const scale = generateColorScale('#6366f1');
// Returns: { 50: '#...', 100: '#...', ..., 900: '#...' }
```

## Layer Styles

Apply glass effects using Chakra's `layerStyle` prop:

```tsx
<Box layerStyle="glass">Basic glass</Box>
<Box layerStyle="glassInteractive">With hover</Box>
<Box layerStyle="glassPrimary">Primary tint</Box>
<Box layerStyle="glassSubtle">Subtle effect</Box>
<Box layerStyle="glassHeavy">Heavy blur</Box>
<Box layerStyle="glassModal">Modal style</Box>
<Box layerStyle="glassNavbar">Navbar style</Box>
<Box layerStyle="glassSidebar">Sidebar style</Box>
```

## Dark Mode

Dark mode is supported automatically. Use Chakra's color mode utilities:

```tsx
import { useColorMode, useColorModeValue } from '@job-board/ui';

function ThemeToggle() {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <GlassButton onClick={toggleColorMode}>
      {colorMode === 'light' ? 'Dark' : 'Light'} Mode
    </GlassButton>
  );
}
```

## TypeScript

All components and utilities are fully typed:

```tsx
import type {
  BrandConfig,
  GlassCardProps,
  GlassButtonProps,
  GlassThemeConfig,
} from '@job-board/ui';
```

## Browser Support

The `backdrop-filter` CSS property is used for glass effects. It has good support in modern browsers. For older browsers, the design gracefully degrades to semi-transparent backgrounds.
