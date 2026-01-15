'use client';

import { JobStatus } from '@borg/types';
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  SimpleGrid,
  Icon,
  Flex,
  Center,
  Spinner,
  GlassCard,
  GlassButton,
} from '@borg/ui';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FiBriefcase,
  FiEye,
  FiPlus,
  FiEdit,
  FiBarChart2,
  FiClock,
  FiFileText,
  FiCheckCircle,
  FiAlertCircle,
} from 'react-icons/fi';

import { JobStatusBadge, JobTierBadge } from '@/components/jobs';
import { useJobs } from '@/hooks/use-jobs';

function formatDate(dateString: string | null): string {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

function getDaysRemaining(expiresAt: string | null): number {
  if (!expiresAt) return 0;
  const now = new Date();
  const expires = new Date(expiresAt);
  const diff = expires.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export default function OverviewPage() {
  const router = useRouter();
  const { data: jobsData, isLoading, error } = useJobs();

  // Calculate stats from real data
  const jobs = jobsData?.data || [];
  const activeJobsCount = jobs.filter((j) => j.status === JobStatus.ACTIVE).length;
  const draftJobsCount = jobs.filter((j) => j.status === JobStatus.DRAFT).length;
  const closedJobsCount = jobs.filter((j) => j.status === JobStatus.CLOSED).length;
  const totalViews = jobs.reduce((sum, j) => sum + j.viewCount, 0);

  // Get recent jobs (last 5)
  const recentJobs = [...jobs]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  if (isLoading) {
    return (
      <Center minH="400px">
        <Spinner size="xl" color="primary.500" />
      </Center>
    );
  }

  if (error) {
    return (
      <VStack spacing={4} py={8}>
        <Icon as={FiAlertCircle} boxSize={12} color="red.500" />
        <Text color="red.500">Failed to load dashboard data</Text>
        <GlassButton onClick={() => window.location.reload()}>
          Try Again
        </GlassButton>
      </VStack>
    );
  }

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
        <GlassCard p={6}>
          <Flex justify="space-between" align="start">
            <VStack align="start" spacing={1}>
              <Text fontSize="sm" color="neutral.500" fontWeight="medium">
                Active Jobs
              </Text>
              <Heading as="h3" size="lg">
                {activeJobsCount}
              </Heading>
            </VStack>
            <Box
              p={3}
              bg="green.50"
              borderRadius="lg"
              color="green.500"
              _dark={{ bg: 'rgba(34, 197, 94, 0.2)' }}
            >
              <Icon as={FiCheckCircle} boxSize={6} />
            </Box>
          </Flex>
        </GlassCard>

        <GlassCard p={6}>
          <Flex justify="space-between" align="start">
            <VStack align="start" spacing={1}>
              <Text fontSize="sm" color="neutral.500" fontWeight="medium">
                Draft Jobs
              </Text>
              <Heading as="h3" size="lg">
                {draftJobsCount}
              </Heading>
            </VStack>
            <Box
              p={3}
              bg="gray.50"
              borderRadius="lg"
              color="gray.500"
              _dark={{ bg: 'rgba(156, 163, 175, 0.2)' }}
            >
              <Icon as={FiFileText} boxSize={6} />
            </Box>
          </Flex>
        </GlassCard>

        <GlassCard p={6}>
          <Flex justify="space-between" align="start">
            <VStack align="start" spacing={1}>
              <Text fontSize="sm" color="neutral.500" fontWeight="medium">
                Closed Jobs
              </Text>
              <Heading as="h3" size="lg">
                {closedJobsCount}
              </Heading>
            </VStack>
            <Box
              p={3}
              bg="red.50"
              borderRadius="lg"
              color="red.500"
              _dark={{ bg: 'rgba(239, 68, 68, 0.2)' }}
            >
              <Icon as={FiBriefcase} boxSize={6} />
            </Box>
          </Flex>
        </GlassCard>

        <GlassCard p={6}>
          <Flex justify="space-between" align="start">
            <VStack align="start" spacing={1}>
              <Text fontSize="sm" color="neutral.500" fontWeight="medium">
                Total Views
              </Text>
              <Heading as="h3" size="lg">
                {totalViews}
              </Heading>
            </VStack>
            <Box
              p={3}
              bg="primary.50"
              borderRadius="lg"
              color="primary.500"
              _dark={{ bg: 'rgba(99, 102, 241, 0.2)' }}
            >
              <Icon as={FiEye} boxSize={6} />
            </Box>
          </Flex>
        </GlassCard>
      </SimpleGrid>

      {/* Recent Jobs Section */}
      <GlassCard p={6}>
        <VStack align="stretch" spacing={4}>
          <Flex justify="space-between" align="center" flexWrap="wrap" gap={4}>
            <Heading as="h3" size="md">
              Your Jobs
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

          {recentJobs.length === 0 ? (
            <VStack spacing={4} py={8}>
              <Icon as={FiBriefcase} boxSize={12} color="neutral.300" />
              <Text color="neutral.500">No jobs yet</Text>
              <Link href="/jobs/create">
                <GlassButton leftIcon={<FiPlus />}>
                  Create Your First Job
                </GlassButton>
              </Link>
            </VStack>
          ) : (
            <VStack align="stretch" spacing={3}>
              {recentJobs.map((job) => (
                <Box
                  key={job.id}
                  p={4}
                  borderRadius="lg"
                  bg="neutral.50"
                  _dark={{ bg: 'rgba(255, 255, 255, 0.05)' }}
                  borderWidth="1px"
                  borderColor="neutral.200"
                  _hover={{ borderColor: 'primary.300', cursor: 'pointer' }}
                  onClick={() => router.push(`/jobs/${job.id}`)}
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
                        <JobStatusBadge status={job.status} />
                        <JobTierBadge tier={job.tier} />
                      </HStack>
                      <HStack spacing={4} fontSize="sm" color="neutral.500">
                        <HStack spacing={1}>
                          <Icon as={FiEye} boxSize={3} />
                          <Text>{job.viewCount} views</Text>
                        </HStack>
                        {job.expiresAt && job.status === JobStatus.ACTIVE && (
                          <HStack spacing={1}>
                            <Icon as={FiClock} boxSize={3} />
                            <Text>{getDaysRemaining(job.expiresAt)} days left</Text>
                          </HStack>
                        )}
                        <Text>Created {formatDate(job.createdAt)}</Text>
                      </HStack>
                    </VStack>
                    <HStack spacing={2}>
                      <GlassButton
                        size="sm"
                        variant="ghost"
                        aria-label="Edit"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/jobs/${job.id}/edit`);
                        }}
                      >
                        <Icon as={FiEdit} />
                      </GlassButton>
                    </HStack>
                  </Flex>
                </Box>
              ))}
            </VStack>
          )}
        </VStack>
      </GlassCard>

      {/* Quick Actions */}
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
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
              <Link href="/jobs">
                <GlassButton w="full" variant="outline" leftIcon={<FiBriefcase />}>
                  Manage Jobs
                </GlassButton>
              </Link>
              <Link href="/analytics">
                <GlassButton w="full" variant="outline" leftIcon={<FiBarChart2 />}>
                  Analytics
                </GlassButton>
              </Link>
              <Link href="/settings">
                <GlassButton w="full" variant="outline" leftIcon={<FiFileText />}>
                  Settings
                </GlassButton>
              </Link>
            </SimpleGrid>
          </VStack>
        </GlassCard>

        <GlassCard p={6}>
          <VStack align="stretch" spacing={4}>
            <Heading as="h3" size="md">
              Job Statistics
            </Heading>
            <VStack align="stretch" spacing={3}>
              <Flex justify="space-between" align="center">
                <HStack spacing={2}>
                  <Icon as={FiBriefcase} color="neutral.500" />
                  <Text fontSize="sm">Total Jobs</Text>
                </HStack>
                <Text fontSize="sm" fontWeight="medium">
                  {jobs.length}
                </Text>
              </Flex>
              <Flex justify="space-between" align="center">
                <HStack spacing={2}>
                  <Icon as={FiCheckCircle} color="green.500" />
                  <Text fontSize="sm">Active</Text>
                </HStack>
                <Text fontSize="sm" fontWeight="medium">
                  {activeJobsCount}
                </Text>
              </Flex>
              <Flex justify="space-between" align="center">
                <HStack spacing={2}>
                  <Icon as={FiFileText} color="gray.500" />
                  <Text fontSize="sm">Drafts</Text>
                </HStack>
                <Text fontSize="sm" fontWeight="medium">
                  {draftJobsCount}
                </Text>
              </Flex>
              <Flex justify="space-between" align="center">
                <HStack spacing={2}>
                  <Icon as={FiEye} color="primary.500" />
                  <Text fontSize="sm">Total Views</Text>
                </HStack>
                <Text fontSize="sm" fontWeight="medium">
                  {totalViews}
                </Text>
              </Flex>
            </VStack>
          </VStack>
        </GlassCard>
      </SimpleGrid>
    </VStack>
  );
}
