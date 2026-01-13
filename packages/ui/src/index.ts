// ===========================================
// @borg/ui - Glassmorphism Design System
// ===========================================

// Theme & Brand
export { createGlassTheme, glassTheme, type GlassThemeConfig } from './theme';
export { brandPresets, type BrandConfig, type BrandPresetName, type ColorScale, type BrandColors } from './brand';

// Provider
export {
  GlassThemeProvider,
  useBrandColors,
  useBrandContext,
  type GlassThemeProviderProps,
} from './provider';

// Components
export {
  // Card
  GlassCard,
  GlassCardBody,
  GlassCardHeader,
  GlassCardFooter,
  type GlassCardProps,

  // Button
  GlassButton,
  type GlassButtonProps,

  // Input
  GlassInput,
  GlassTextarea,
  GlassSelect,
  type GlassInputProps,
  type GlassTextareaProps,
  type GlassSelectProps,

  // Modal
  GlassModal,
  GlassModalOverlay,
  GlassModalContent,
  GlassModalHeader,
  GlassModalBody,
  GlassModalFooter,
  GlassModalCloseButton,
  type GlassModalProps,
  type GlassModalContentProps,

  // Navbar
  GlassNavbar,
  GlassNavbarItem,
  type GlassNavbarProps,
  type GlassNavbarItemProps,

  // Sidebar
  GlassSidebar,
  GlassSidebarItem,
  GlassSidebarSection,
  type GlassSidebarProps,
  type GlassSidebarItemProps,
  type GlassSidebarSectionProps,

  // Panel
  GlassPanel,
  type GlassPanelProps,
} from './components';

// Utilities
export {
  generateColorScale,
  hexToRgba,
  useGlassStyles,
  glassStylePresets,
  type GlassStyleOptions,
  type GlassStyles,
} from './utils';

// Layer styles (for advanced usage)
export { layerStyles } from './theme/layerStyles';

// Re-export commonly used Chakra UI components for convenience
export {
  // Layout
  Box,
  Flex,
  Stack,
  HStack,
  VStack,
  Grid,
  GridItem,
  Container,
  Center,
  Spacer,
  Divider,

  // Typography
  Text,
  Heading,
  Link,

  // Forms
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,

  // Feedback
  Spinner,
  Progress,
  Skeleton,
  SkeletonText,
  SkeletonCircle,

  // Overlay
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  Tooltip,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,

  // Data Display
  Badge,
  Avatar,
  AvatarBadge,
  AvatarGroup,
  Icon,
  Image,
  Tag,
  TagLabel,
  TagCloseButton,

  // Navigation
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,

  // Other
  IconButton,
  CloseButton,
  Portal,
  VisuallyHidden,

  // Hooks
  useColorMode,
  useColorModeValue,
  useDisclosure,
  useToast,
  useBreakpointValue,
  useMediaQuery,
} from '@chakra-ui/react';
