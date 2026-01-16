"use client";

import {
  Box,
  Flex,
  VStack,
  HStack,
  Text,
  Icon,
  IconButton,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerBody,
  GlassSidebar,
} from "@job-board/ui";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import {
  FiHome,
  FiUsers,
  FiBriefcase,
  FiGrid,
  FiMapPin,
  FiLayers,
  FiBarChart2,
  FiMenu,
  FiLogOut,
  FiSettings,
} from "react-icons/fi";

import { useAuthStore } from "@/store/auth.store";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType;
}

const navItems: NavItem[] = [
  { label: "Overview", href: "/dashboard", icon: FiHome },
  { label: "Users", href: "/dashboard/users", icon: FiUsers },
  {
    label: "Organizations",
    href: "/dashboard/organizations",
    icon: FiBriefcase,
  },
  { label: "Jobs", href: "/dashboard/jobs", icon: FiGrid },
  { label: "Categories", href: "/dashboard/categories", icon: FiLayers },
  { label: "Locations", href: "/dashboard/locations", icon: FiMapPin },
  { label: "Tenants", href: "/dashboard/tenants", icon: FiLayers },
  { label: "Analytics", href: "/dashboard/analytics", icon: FiBarChart2 },
];

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleNavClick = (href: string) => {
    router.push(href);
    onClose?.();
  };

  return (
    <VStack align="stretch" spacing={1} p={4}>
      <Text
        fontSize="xs"
        fontWeight="semibold"
        color="whiteAlpha.500"
        textTransform="uppercase"
        letterSpacing="wide"
        mb={2}
        px={3}
      >
        Navigation
      </Text>
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <HStack
            key={item.href}
            px={3}
            py={2}
            borderRadius="md"
            cursor="pointer"
            bg={isActive ? "whiteAlpha.200" : "transparent"}
            color={isActive ? "white" : "whiteAlpha.700"}
            _hover={{ bg: "whiteAlpha.100", color: "white" }}
            onClick={() => handleNavClick(item.href)}
            transition="all 0.2s"
          >
            <Icon as={item.icon} boxSize={5} />
            <Text fontSize="sm" fontWeight="medium">
              {item.label}
            </Text>
          </HStack>
        );
      })}
    </VStack>
  );
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, isAuthenticated, isHydrated, logout } = useAuthStore();

  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isHydrated, isAuthenticated, router]);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  if (!isHydrated || !isAuthenticated) {
    return null;
  }

  return (
    <Flex minH="100vh" bg="gray.900">
      {/* Desktop Sidebar */}
      <Box display={{ base: "none", md: "block" }} w="250px" flexShrink={0}>
        <GlassSidebar>
          <VStack align="stretch" h="full">
            <Box p={4} borderBottom="1px" borderColor="whiteAlpha.100">
              <Text fontSize="xl" fontWeight="bold" color="white">
                job-board Admin
              </Text>
            </Box>
            <Box flex="1" overflowY="auto">
              <SidebarContent />
            </Box>
          </VStack>
        </GlassSidebar>
      </Box>

      {/* Mobile Drawer */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent bg="gray.800">
          <DrawerBody p={0}>
            <VStack align="stretch" h="full">
              <Box p={4} borderBottom="1px" borderColor="whiteAlpha.100">
                <Text fontSize="xl" fontWeight="bold" color="white">
                  job-board Admin
                </Text>
              </Box>
              <SidebarContent onClose={onClose} />
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Main Content */}
      <Box flex="1" overflow="auto">
        {/* Header */}
        <HStack
          px={6}
          py={4}
          bg="whiteAlpha.50"
          borderBottom="1px"
          borderColor="whiteAlpha.100"
          justify="space-between"
        >
          <HStack>
            <IconButton
              aria-label="Open menu"
              icon={<FiMenu />}
              variant="ghost"
              color="white"
              display={{ base: "flex", md: "none" }}
              onClick={onOpen}
            />
          </HStack>

          <Menu>
            <MenuButton>
              <HStack spacing={3} cursor="pointer">
                <VStack
                  spacing={0}
                  align="end"
                  display={{ base: "none", sm: "flex" }}
                >
                  <Text fontSize="sm" fontWeight="medium" color="white">
                    {user?.email}
                  </Text>
                  <Text fontSize="xs" color="whiteAlpha.600">
                    {user?.role}
                  </Text>
                </VStack>
                <Avatar size="sm" name={user?.email} />
              </HStack>
            </MenuButton>
            <MenuList bg="gray.800" borderColor="whiteAlpha.200">
              <MenuItem
                icon={<FiSettings />}
                _hover={{ bg: "whiteAlpha.100" }}
                color="white"
              >
                Settings
              </MenuItem>
              <MenuDivider borderColor="whiteAlpha.200" />
              <MenuItem
                icon={<FiLogOut />}
                _hover={{ bg: "whiteAlpha.100" }}
                color="red.400"
                onClick={handleLogout}
              >
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        </HStack>

        {/* Page Content */}
        <Box p={6}>{children}</Box>
      </Box>
    </Flex>
  );
}
