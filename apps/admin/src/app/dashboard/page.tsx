"use client";

import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  HStack,
  Icon,
  GlassCard,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
} from "@job-board/ui";
import {
  FiUsers,
  FiBriefcase,
  FiGrid,
  FiEye,
  FiFileText,
  FiTrendingUp,
} from "react-icons/fi";

interface StatCardProps {
  label: string;
  value: string | number;
  helpText?: string;
  change?: number;
  icon: React.ComponentType;
  color: string;
}

function StatCard({
  label,
  value,
  helpText,
  change,
  icon,
  color,
}: StatCardProps) {
  return (
    <GlassCard p={6}>
      <HStack justify="space-between" align="start">
        <Stat>
          <StatLabel color="whiteAlpha.700">{label}</StatLabel>
          <StatNumber fontSize="3xl" color="white">
            {value}
          </StatNumber>
          {helpText && (
            <StatHelpText color="whiteAlpha.600">
              {change !== undefined && (
                <StatArrow type={change >= 0 ? "increase" : "decrease"} />
              )}
              {helpText}
            </StatHelpText>
          )}
        </Stat>
        <Box p={3} borderRadius="full" bg={`${color}.500`} color="white">
          <Icon as={icon} boxSize={6} />
        </Box>
      </HStack>
    </GlassCard>
  );
}

export default function DashboardPage() {
  // Mock data - would come from API in production
  const stats = [
    {
      label: "Total Users",
      value: "12,345",
      helpText: "+12% from last month",
      change: 12,
      icon: FiUsers,
      color: "blue",
    },
    {
      label: "Organizations",
      value: "456",
      helpText: "+8% from last month",
      change: 8,
      icon: FiBriefcase,
      color: "green",
    },
    {
      label: "Active Jobs",
      value: "2,345",
      helpText: "+15% from last month",
      change: 15,
      icon: FiGrid,
      color: "purple",
    },
    {
      label: "Job Views (Today)",
      value: "45.2K",
      helpText: "+22% from yesterday",
      change: 22,
      icon: FiEye,
      color: "orange",
    },
    {
      label: "Applications",
      value: "8,901",
      helpText: "+18% from last month",
      change: 18,
      icon: FiFileText,
      color: "teal",
    },
    {
      label: "Conversion Rate",
      value: "3.8%",
      helpText: "+0.5% from last month",
      change: 0.5,
      icon: FiTrendingUp,
      color: "pink",
    },
  ];

  return (
    <VStack spacing={8} align="stretch">
      <Box>
        <Heading size="lg" color="white" mb={2}>
          Dashboard Overview
        </Heading>
        <Text color="whiteAlpha.700">
          Welcome to the admin dashboard. Here&apos;s an overview of your
          platform.
        </Text>
      </Box>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
        <GlassCard p={6}>
          <Heading size="md" color="white" mb={4}>
            Quick Actions
          </Heading>
          <VStack align="stretch" spacing={3}>
            <Text color="whiteAlpha.700" fontSize="sm">
              - Manage users and organizations
            </Text>
            <Text color="whiteAlpha.700" fontSize="sm">
              - Review pending job listings
            </Text>
            <Text color="whiteAlpha.700" fontSize="sm">
              - Configure categories and locations
            </Text>
            <Text color="whiteAlpha.700" fontSize="sm">
              - View platform analytics
            </Text>
          </VStack>
        </GlassCard>

        <GlassCard p={6}>
          <Heading size="md" color="white" mb={4}>
            Recent Activity
          </Heading>
          <VStack align="stretch" spacing={3}>
            <HStack justify="space-between">
              <Text color="whiteAlpha.700" fontSize="sm">
                New user registered
              </Text>
              <Text color="whiteAlpha.500" fontSize="xs">
                2 min ago
              </Text>
            </HStack>
            <HStack justify="space-between">
              <Text color="whiteAlpha.700" fontSize="sm">
                Organization verified
              </Text>
              <Text color="whiteAlpha.500" fontSize="xs">
                15 min ago
              </Text>
            </HStack>
            <HStack justify="space-between">
              <Text color="whiteAlpha.700" fontSize="sm">
                New job published
              </Text>
              <Text color="whiteAlpha.500" fontSize="xs">
                1 hour ago
              </Text>
            </HStack>
          </VStack>
        </GlassCard>
      </SimpleGrid>
    </VStack>
  );
}
