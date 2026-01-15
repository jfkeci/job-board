'use client';

import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  SimpleGrid,
  Icon,
  Flex,
  Badge,
  GlassCard,
  GlassButton,
} from '@borg/ui';
import Link from 'next/link';
import {
  FiBriefcase,
  FiUsers,
  FiInbox,
  FiEye,
  FiArrowUp,
  FiArrowDown,
  FiPlus,
  FiEdit,
  FiPause,
  FiFileText,
  FiBarChart2,
  FiUser,
  FiCheck,
  FiDatabase,
  FiClock,
} from 'react-icons/fi';

// =============================================================================
// Type Definitions
// =============================================================================

interface JobPost {
  id: string;
  title: string;
  status: 'active' | 'paused' | 'expired' | 'draft';
  tier: 'basic' | 'standard' | 'premium' | 'exclusive';
  applications: number;
  views: number;
  postedAt: string;
  expiresAt: string;
  daysRemaining: number;
}

interface Application {
  id: string;
  applicantName: string;
  jobTitle: string;
  jobId: string;
  appliedAt: string;
  status: 'new' | 'reviewed' | 'shortlisted' | 'rejected';
}

interface StatCard {
  label: string;
  value: string | number;
  change: string;
  isPositive: boolean;
  icon: typeof FiBriefcase;
}

// =============================================================================
// Mock Data
// =============================================================================

const stats: StatCard[] = [
  {
    label: 'Active Jobs',
    value: 5,
    change: '+2',
    isPositive: true,
    icon: FiBriefcase,
  },
  {
    label: 'Total Applications',
    value: 47,
    change: '+12',
    isPositive: true,
    icon: FiUsers,
  },
  {
    label: 'New Applications',
    value: 12,
    change: '+25%',
    isPositive: true,
    icon: FiInbox,
  },
  {
    label: 'Profile Views',
    value: 234,
    change: '+18%',
    isPositive: true,
    icon: FiEye,
  },
];

const activeJobs: JobPost[] = [
  {
    id: '1',
    title: 'Senior Frontend Developer',
    status: 'active',
    tier: 'premium',
    applications: 12,
    views: 89,
    postedAt: '2026-01-10',
    expiresAt: '2026-02-10',
    daysRemaining: 26,
  },
  {
    id: '2',
    title: 'Marketing Manager',
    status: 'active',
    tier: 'standard',
    applications: 8,
    views: 45,
    postedAt: '2026-01-12',
    expiresAt: '2026-02-12',
    daysRemaining: 28,
  },
  {
    id: '3',
    title: 'Sales Representative',
    status: 'active',
    tier: 'basic',
    applications: 3,
    views: 23,
    postedAt: '2026-01-14',
    expiresAt: '2026-02-14',
    daysRemaining: 30,
  },
  {
    id: '4',
    title: 'Product Designer',
    status: 'paused',
    tier: 'exclusive',
    applications: 18,
    views: 156,
    postedAt: '2026-01-05',
    expiresAt: '2026-02-05',
    daysRemaining: 21,
  },
  {
    id: '5',
    title: 'Customer Success Manager',
    status: 'active',
    tier: 'standard',
    applications: 6,
    views: 34,
    postedAt: '2026-01-13',
    expiresAt: '2026-02-13',
    daysRemaining: 29,
  },
];

const recentApplications: Application[] = [
  {
    id: '1',
    applicantName: 'John Davidson',
    jobTitle: 'Senior Frontend Developer',
    jobId: '1',
    appliedAt: '2 hours ago',
    status: 'new',
  },
  {
    id: '2',
    applicantName: 'Sarah Mitchell',
    jobTitle: 'Marketing Manager',
    jobId: '2',
    appliedAt: '5 hours ago',
    status: 'reviewed',
  },
  {
    id: '3',
    applicantName: 'Michael Chen',
    jobTitle: 'Senior Frontend Developer',
    jobId: '1',
    appliedAt: '1 day ago',
    status: 'shortlisted',
  },
  {
    id: '4',
    applicantName: 'Emily Rodriguez',
    jobTitle: 'Product Designer',
    jobId: '4',
    appliedAt: '1 day ago',
    status: 'reviewed',
  },
  {
    id: '5',
    applicantName: 'David Kim',
    jobTitle: 'Sales Representative',
    jobId: '3',
    appliedAt: '2 days ago',
    status: 'new',
  },
];

const subscriptionInfo = {
  tier: 'standard' as const,
  cvDatabaseAccess: true,
  jobPostsUsed: 5,
  jobPostsLimit: 10,
};

// =============================================================================
// Helper Functions
// =============================================================================

const getTierColor = (tier: JobPost['tier']) => {
  const colors = {
    basic: 'gray',
    standard: 'blue',
    premium: 'purple',
    exclusive: 'orange',
  };
  return colors[tier];
};

const getStatusColor = (status: JobPost['status']) => {
  const colors = {
    active: 'green',
    paused: 'yellow',
    expired: 'red',
    draft: 'gray',
  };
  return colors[status];
};

const getApplicationStatusColor = (status: Application['status']) => {
  const colors = {
    new: 'blue',
    reviewed: 'purple',
    shortlisted: 'green',
    rejected: 'red',
  };
  return colors[status];
};

// =============================================================================
// Component
// =============================================================================

export default function OverviewPage() {
  return (
    <VStack spacing={8} align="stretch">
      {/* Page Header */}
      <Box>
        <Heading as="h1" size="lg" mb={2}>
          Dashboard Overview
        </Heading>
        <Text color="neutral.600" _dark={{ color: 'neutral.400' }}>
          Welcome back! Here&apos;s your recruitment activity at a glance.
        </Text>
      </Box>

      {/* Stats Grid */}
      <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={6}>
        {stats.map((stat, index) => (
          <GlassCard key={index} p={6}>
            <Flex justify="space-between" align="start">
              <VStack align="start" spacing={1}>
                <Text
                  fontSize="sm"
                  color="neutral.500"
                  fontWeight="medium"
                >
                  {stat.label}
                </Text>
                <Heading as="h3" size="lg">
                  {stat.value}
                </Heading>
                <HStack spacing={1}>
                  <Icon
                    as={stat.isPositive ? FiArrowUp : FiArrowDown}
                    color={stat.isPositive ? 'green.500' : 'red.500'}
                    boxSize={4}
                  />
                  <Text
                    fontSize="sm"
                    color={stat.isPositive ? 'green.500' : 'red.500'}
                    fontWeight="medium"
                  >
                    {stat.change}
                  </Text>
                  <Text fontSize="sm" color="neutral.500">
                    vs last month
                  </Text>
                </HStack>
              </VStack>
              <Box
                p={3}
                bg="primary.50"
                borderRadius="lg"
                color="primary.500"
                _dark={{ bg: 'rgba(99, 102, 241, 0.2)' }}
              >
                <Icon as={stat.icon} boxSize={6} />
              </Box>
            </Flex>
          </GlassCard>
        ))}
      </SimpleGrid>

      {/* Active Jobs Section */}
      <GlassCard p={6}>
        <VStack align="stretch" spacing={4}>
          <Flex justify="space-between" align="center" flexWrap="wrap" gap={4}>
            <Heading as="h3" size="md">
              Your Active Jobs
            </Heading>
            <HStack spacing={3}>
              <Link href="/jobs">
                <GlassButton size="sm" variant="ghost">
                  View All Jobs
                </GlassButton>
              </Link>
              <Link href="/jobs/create">
                <GlassButton size="sm" leftIcon={<FiPlus />}>
                  Post New Job
                </GlassButton>
              </Link>
            </HStack>
          </Flex>

          <VStack align="stretch" spacing={3}>
            {activeJobs.map((job) => (
              <Box
                key={job.id}
                p={4}
                borderRadius="lg"
                bg="neutral.50"
                _dark={{ bg: 'rgba(255, 255, 255, 0.05)' }}
                borderWidth="1px"
                borderColor="neutral.200"
                _hover={{ borderColor: 'primary.300' }}
              >
                <Flex
                  justify="space-between"
                  align={{ base: 'start', md: 'center' }}
                  direction={{ base: 'column', md: 'row' }}
                  gap={3}
                >
                  <VStack align="start" spacing={1}>
                    <HStack spacing={2}>
                      <Text fontWeight="semibold">{job.title}</Text>
                      <Badge
                        colorScheme={getStatusColor(job.status)}
                        textTransform="capitalize"
                        fontSize="xs"
                      >
                        {job.status}
                      </Badge>
                      <Badge
                        colorScheme={getTierColor(job.tier)}
                        textTransform="capitalize"
                        fontSize="xs"
                      >
                        {job.tier}
                      </Badge>
                    </HStack>
                    <HStack spacing={4} fontSize="sm" color="neutral.500">
                      <HStack spacing={1}>
                        <Icon as={FiUsers} boxSize={3} />
                        <Text>{job.applications} applications</Text>
                      </HStack>
                      <HStack spacing={1}>
                        <Icon as={FiEye} boxSize={3} />
                        <Text>{job.views} views</Text>
                      </HStack>
                      <HStack spacing={1}>
                        <Icon as={FiClock} boxSize={3} />
                        <Text>{job.daysRemaining} days left</Text>
                      </HStack>
                    </HStack>
                  </VStack>
                  <HStack spacing={2}>
                    <GlassButton size="sm" variant="ghost" aria-label="Edit">
                      <Icon as={FiEdit} />
                    </GlassButton>
                    <GlassButton size="sm" variant="ghost" aria-label="Pause">
                      <Icon as={FiPause} />
                    </GlassButton>
                  </HStack>
                </Flex>
              </Box>
            ))}
          </VStack>
        </VStack>
      </GlassCard>

      {/* Bottom Grid: Applications + Quick Actions */}
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
        {/* Recent Applications */}
        <GlassCard p={6}>
          <VStack align="stretch" spacing={4}>
            <Flex justify="space-between" align="center">
              <Heading as="h3" size="md">
                Recent Applications
              </Heading>
              <Link href="/applications">
                <GlassButton size="sm" variant="ghost">
                  View All
                </GlassButton>
              </Link>
            </Flex>
            <VStack
              align="stretch"
              spacing={3}
              divider={
                <Box
                  borderBottom="1px"
                  borderColor="neutral.200"
                  _dark={{ borderColor: 'neutral.700' }}
                />
              }
            >
              {recentApplications.map((application) => (
                <Flex
                  key={application.id}
                  justify="space-between"
                  align="center"
                  py={2}
                >
                  <HStack spacing={3}>
                    <Box
                      p={2}
                      bg="neutral.100"
                      borderRadius="full"
                      _dark={{ bg: 'neutral.700' }}
                    >
                      <Icon as={FiUser} boxSize={4} color="neutral.500" />
                    </Box>
                    <VStack align="start" spacing={0}>
                      <Text fontWeight="medium" fontSize="sm">
                        {application.applicantName}
                      </Text>
                      <Text fontSize="xs" color="neutral.500">
                        {application.jobTitle}
                      </Text>
                    </VStack>
                  </HStack>
                  <VStack align="end" spacing={1}>
                    <Badge
                      colorScheme={getApplicationStatusColor(application.status)}
                      textTransform="capitalize"
                      fontSize="xs"
                    >
                      {application.status}
                    </Badge>
                    <Text fontSize="xs" color="neutral.500">
                      {application.appliedAt}
                    </Text>
                  </VStack>
                </Flex>
              ))}
            </VStack>
          </VStack>
        </GlassCard>

        {/* Quick Actions + Subscription */}
        <VStack spacing={6} align="stretch">
          {/* Quick Actions */}
          <GlassCard p={6}>
            <VStack align="stretch" spacing={4}>
              <Heading as="h3" size="md">
                Quick Actions
              </Heading>
              <SimpleGrid columns={2} spacing={3}>
                <Link href="/jobs/create">
                  <GlassButton w="full" leftIcon={<FiPlus />}>
                    Post a Job
                  </GlassButton>
                </Link>
                <Link href="/cv-database">
                  <GlassButton w="full" variant="outline" leftIcon={<FiDatabase />}>
                    Browse CVs
                  </GlassButton>
                </Link>
                <Link href="/analytics">
                  <GlassButton w="full" variant="outline" leftIcon={<FiBarChart2 />}>
                    Analytics
                  </GlassButton>
                </Link>
                <Link href="/company">
                  <GlassButton w="full" variant="outline" leftIcon={<FiFileText />}>
                    Company Profile
                  </GlassButton>
                </Link>
              </SimpleGrid>
            </VStack>
          </GlassCard>

          {/* Subscription Status */}
          <GlassCard p={6}>
            <VStack align="stretch" spacing={4}>
              <Flex justify="space-between" align="center">
                <Heading as="h3" size="md">
                  Your Plan
                </Heading>
                <Badge colorScheme="blue" textTransform="capitalize" fontSize="sm">
                  {subscriptionInfo.tier}
                </Badge>
              </Flex>
              <VStack align="stretch" spacing={3}>
                <Flex justify="space-between" align="center">
                  <HStack spacing={2}>
                    <Icon as={FiBriefcase} color="neutral.500" />
                    <Text fontSize="sm">Job Posts</Text>
                  </HStack>
                  <Text fontSize="sm" fontWeight="medium">
                    {subscriptionInfo.jobPostsUsed} / {subscriptionInfo.jobPostsLimit}
                  </Text>
                </Flex>
                <Flex justify="space-between" align="center">
                  <HStack spacing={2}>
                    <Icon as={FiDatabase} color="neutral.500" />
                    <Text fontSize="sm">CV Database Access</Text>
                  </HStack>
                  {subscriptionInfo.cvDatabaseAccess ? (
                    <HStack spacing={1} color="green.500">
                      <Icon as={FiCheck} boxSize={4} />
                      <Text fontSize="sm" fontWeight="medium">
                        Enabled
                      </Text>
                    </HStack>
                  ) : (
                    <Text fontSize="sm" color="neutral.500">
                      Not included
                    </Text>
                  )}
                </Flex>
                <Link href="/pricing">
                  <GlassButton size="sm" variant="outline" w="full" mt={2}>
                    Upgrade Plan
                  </GlassButton>
                </Link>
              </VStack>
            </VStack>
          </GlassCard>
        </VStack>
      </SimpleGrid>
    </VStack>
  );
}
