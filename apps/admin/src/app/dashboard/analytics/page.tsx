"use client";

import {
  Box,
  Flex,
  VStack,
  HStack,
  Text,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Spinner,
  Icon,
  GlassCard,
} from "@job-board/ui";
import { useQuery } from "@tanstack/react-query";
import {
  FiUsers,
  FiBriefcase,
  FiFileText,
  FiEye,
  FiTrendingUp,
  FiActivity,
} from "react-icons/fi";

import { adminApi } from "@/lib/api";

interface AnalyticsStat {
  label: string;
  value: number | string;
  helpText?: string;
  icon: React.ComponentType;
  color: string;
}

export default function AnalyticsPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: adminApi.getStats,
  });

  const analyticsStats: AnalyticsStat[] = [
    {
      label: "Total Users",
      value: stats?.totalUsers?.toLocaleString() || 0,
      helpText: `${stats?.recentSignups || 0} new this week`,
      icon: FiUsers,
      color: "blue.400",
    },
    {
      label: "Organizations",
      value: stats?.totalOrganizations?.toLocaleString() || 0,
      helpText: "Active companies",
      icon: FiBriefcase,
      color: "green.400",
    },
    {
      label: "Total Jobs",
      value: stats?.totalJobs?.toLocaleString() || 0,
      helpText: `${stats?.activeJobs || 0} active`,
      icon: FiFileText,
      color: "purple.400",
    },
    {
      label: "Applications",
      value: stats?.totalApplications?.toLocaleString() || 0,
      helpText: "All time",
      icon: FiEye,
      color: "orange.400",
    },
  ];

  return (
    <VStack align="stretch" spacing={6}>
      <Box>
        <Text fontSize="2xl" fontWeight="bold" color="white">
          Analytics
        </Text>
        <Text color="whiteAlpha.600" fontSize="sm">
          Platform metrics and performance insights
        </Text>
      </Box>

      {isLoading ? (
        <Flex justify="center" py={12}>
          <Spinner color="white" size="lg" />
        </Flex>
      ) : (
        <>
          {/* Stats Grid */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
            {analyticsStats.map((stat) => (
              <GlassCard key={stat.label} p={6}>
                <Stat>
                  <Flex justify="space-between" align="start">
                    <Box>
                      <StatLabel color="whiteAlpha.600" fontSize="sm">
                        {stat.label}
                      </StatLabel>
                      <StatNumber color="white" fontSize="3xl" mt={2}>
                        {stat.value}
                      </StatNumber>
                      {stat.helpText && (
                        <StatHelpText
                          color="whiteAlpha.500"
                          fontSize="xs"
                          mt={1}
                        >
                          {stat.helpText}
                        </StatHelpText>
                      )}
                    </Box>
                    <Box
                      p={3}
                      borderRadius="lg"
                      bg="whiteAlpha.100"
                      color={stat.color}
                    >
                      <Icon as={stat.icon} boxSize={6} />
                    </Box>
                  </Flex>
                </Stat>
              </GlassCard>
            ))}
          </SimpleGrid>

          {/* Activity Overview */}
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
            <GlassCard p={6}>
              <HStack mb={4}>
                <Box
                  p={2}
                  borderRadius="md"
                  bg="whiteAlpha.100"
                  color="blue.400"
                >
                  <FiTrendingUp size={20} />
                </Box>
                <Text fontSize="lg" fontWeight="semibold" color="white">
                  Platform Growth
                </Text>
              </HStack>
              <VStack align="stretch" spacing={4}>
                <Box>
                  <Flex justify="space-between" mb={2}>
                    <Text fontSize="sm" color="whiteAlpha.700">
                      User Growth
                    </Text>
                    <Text fontSize="sm" color="green.400">
                      +12%
                    </Text>
                  </Flex>
                  <Box h="8px" bg="whiteAlpha.100" borderRadius="full">
                    <Box h="8px" w="65%" bg="green.400" borderRadius="full" />
                  </Box>
                </Box>
                <Box>
                  <Flex justify="space-between" mb={2}>
                    <Text fontSize="sm" color="whiteAlpha.700">
                      Job Postings
                    </Text>
                    <Text fontSize="sm" color="blue.400">
                      +8%
                    </Text>
                  </Flex>
                  <Box h="8px" bg="whiteAlpha.100" borderRadius="full">
                    <Box h="8px" w="45%" bg="blue.400" borderRadius="full" />
                  </Box>
                </Box>
                <Box>
                  <Flex justify="space-between" mb={2}>
                    <Text fontSize="sm" color="whiteAlpha.700">
                      Applications
                    </Text>
                    <Text fontSize="sm" color="purple.400">
                      +23%
                    </Text>
                  </Flex>
                  <Box h="8px" bg="whiteAlpha.100" borderRadius="full">
                    <Box h="8px" w="78%" bg="purple.400" borderRadius="full" />
                  </Box>
                </Box>
              </VStack>
            </GlassCard>

            <GlassCard p={6}>
              <HStack mb={4}>
                <Box
                  p={2}
                  borderRadius="md"
                  bg="whiteAlpha.100"
                  color="orange.400"
                >
                  <FiActivity size={20} />
                </Box>
                <Text fontSize="lg" fontWeight="semibold" color="white">
                  Recent Activity
                </Text>
              </HStack>
              <VStack align="stretch" spacing={3}>
                {[
                  {
                    action: "New user registered",
                    time: "2 minutes ago",
                    color: "blue.400",
                  },
                  {
                    action: "Job posted by Acme Corp",
                    time: "15 minutes ago",
                    color: "green.400",
                  },
                  {
                    action: "Application submitted",
                    time: "32 minutes ago",
                    color: "purple.400",
                  },
                  {
                    action: "Organization created",
                    time: "1 hour ago",
                    color: "orange.400",
                  },
                  {
                    action: "New user registered",
                    time: "2 hours ago",
                    color: "blue.400",
                  },
                ].map((activity, i) => (
                  <HStack key={i} spacing={3}>
                    <Box
                      w="8px"
                      h="8px"
                      borderRadius="full"
                      bg={activity.color}
                    />
                    <Box flex="1">
                      <Text fontSize="sm" color="white">
                        {activity.action}
                      </Text>
                      <Text fontSize="xs" color="whiteAlpha.500">
                        {activity.time}
                      </Text>
                    </Box>
                  </HStack>
                ))}
              </VStack>
            </GlassCard>
          </SimpleGrid>

          {/* Top Performers */}
          <GlassCard p={6}>
            <Text fontSize="lg" fontWeight="semibold" color="white" mb={4}>
              Top Performing Jobs
            </Text>
            <Box overflowX="auto">
              <Box as="table" w="full" fontSize="sm">
                <Box as="thead">
                  <Box as="tr" borderBottom="1px" borderColor="whiteAlpha.100">
                    <Box
                      as="th"
                      py={2}
                      px={4}
                      textAlign="left"
                      color="whiteAlpha.600"
                    >
                      Job Title
                    </Box>
                    <Box
                      as="th"
                      py={2}
                      px={4}
                      textAlign="left"
                      color="whiteAlpha.600"
                    >
                      Company
                    </Box>
                    <Box
                      as="th"
                      py={2}
                      px={4}
                      textAlign="center"
                      color="whiteAlpha.600"
                    >
                      Views
                    </Box>
                    <Box
                      as="th"
                      py={2}
                      px={4}
                      textAlign="center"
                      color="whiteAlpha.600"
                    >
                      Applications
                    </Box>
                    <Box
                      as="th"
                      py={2}
                      px={4}
                      textAlign="center"
                      color="whiteAlpha.600"
                    >
                      Conversion
                    </Box>
                  </Box>
                </Box>
                <Box as="tbody">
                  {[
                    {
                      title: "Senior Software Engineer",
                      company: "TechCorp",
                      views: 2450,
                      apps: 89,
                      conv: "3.6%",
                    },
                    {
                      title: "Product Manager",
                      company: "StartupXYZ",
                      views: 1890,
                      apps: 67,
                      conv: "3.5%",
                    },
                    {
                      title: "UX Designer",
                      company: "DesignCo",
                      views: 1654,
                      apps: 52,
                      conv: "3.1%",
                    },
                    {
                      title: "Data Analyst",
                      company: "DataInc",
                      views: 1432,
                      apps: 41,
                      conv: "2.9%",
                    },
                    {
                      title: "Marketing Lead",
                      company: "GrowthHub",
                      views: 1205,
                      apps: 38,
                      conv: "3.2%",
                    },
                  ].map((job, i) => (
                    <Box
                      as="tr"
                      key={i}
                      borderBottom="1px"
                      borderColor="whiteAlpha.50"
                      _hover={{ bg: "whiteAlpha.50" }}
                    >
                      <Box as="td" py={3} px={4} color="white">
                        {job.title}
                      </Box>
                      <Box as="td" py={3} px={4} color="whiteAlpha.700">
                        {job.company}
                      </Box>
                      <Box
                        as="td"
                        py={3}
                        px={4}
                        textAlign="center"
                        color="whiteAlpha.800"
                      >
                        {job.views.toLocaleString()}
                      </Box>
                      <Box
                        as="td"
                        py={3}
                        px={4}
                        textAlign="center"
                        color="whiteAlpha.800"
                      >
                        {job.apps}
                      </Box>
                      <Box
                        as="td"
                        py={3}
                        px={4}
                        textAlign="center"
                        color="green.400"
                      >
                        {job.conv}
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
          </GlassCard>
        </>
      )}
    </VStack>
  );
}
