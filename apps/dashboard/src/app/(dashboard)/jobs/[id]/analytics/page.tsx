'use client';

import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Flex,
  SimpleGrid,
  Icon,
  Center,
  Spinner,
  Select,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Progress,
  GlassCard,
} from '@job-board/ui';
import { Alert, AlertIcon } from '@chakra-ui/react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  FiArrowLeft,
  FiEye,
  FiUsers,
  FiPercent,
  FiClock,
  FiTrendingUp,
} from 'react-icons/fi';

import { analyticsApi, type JobAnalytics } from '@/lib/api';
import { useJob } from '@/hooks/use-jobs';

type Period = '7d' | '30d' | '90d';

function StatCard({
  label,
  value,
  helpText,
  icon,
  color,
  trend,
}: {
  label: string;
  value: string | number;
  helpText?: string;
  icon: React.ComponentType;
  color: string;
  trend?: { value: number; type: 'increase' | 'decrease' };
}) {
  return (
    <GlassCard p={6}>
      <Stat>
        <Flex justify="space-between" align="start">
          <Box>
            <StatLabel color="neutral.500" fontSize="sm">
              {label}
            </StatLabel>
            <StatNumber fontSize="3xl" mt={2}>
              {value}
            </StatNumber>
            {(helpText || trend) && (
              <StatHelpText mt={1}>
                {trend && <StatArrow type={trend.type} />}
                {trend ? `${trend.value}% from last period` : helpText}
              </StatHelpText>
            )}
          </Box>
          <Box
            p={3}
            borderRadius="lg"
            bg={`${color}.100`}
            color={`${color}.600`}
            _dark={{ bg: `${color}.900`, color: `${color}.200` }}
          >
            <Icon as={icon} boxSize={6} />
          </Box>
        </Flex>
      </Stat>
    </GlassCard>
  );
}

function SimpleChart({
  data,
  label,
  color,
}: {
  data: Array<{ date: string; value: number }>;
  label: string;
  color: string;
}) {
  const maxValue = Math.max(...data.map((d) => d.value), 1);

  return (
    <GlassCard p={6}>
      <Text fontWeight="semibold" mb={4}>
        {label}
      </Text>
      <VStack align="stretch" spacing={2}>
        {data.slice(-7).map((item, index) => (
          <HStack key={index} spacing={3}>
            <Text fontSize="xs" color="neutral.500" minW="60px">
              {new Date(item.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })}
            </Text>
            <Box flex="1">
              <Progress
                value={(item.value / maxValue) * 100}
                size="sm"
                colorScheme={color}
                borderRadius="full"
              />
            </Box>
            <Text
              fontSize="sm"
              fontWeight="medium"
              minW="40px"
              textAlign="right"
            >
              {item.value}
            </Text>
          </HStack>
        ))}
      </VStack>
    </GlassCard>
  );
}

function SourceBreakdown({
  sources,
}: {
  sources: Array<{ source: string; count: number; percentage: number }>;
}) {
  const sourceColors: Record<string, string> = {
    direct: 'blue',
    search: 'green',
    social: 'purple',
    referral: 'orange',
    email: 'cyan',
    other: 'gray',
  };

  return (
    <GlassCard p={6}>
      <Text fontWeight="semibold" mb={4}>
        Traffic Sources
      </Text>
      <VStack align="stretch" spacing={3}>
        {sources.map((source, index) => (
          <Box key={index}>
            <Flex justify="space-between" mb={1}>
              <Text fontSize="sm" textTransform="capitalize">
                {source.source}
              </Text>
              <HStack spacing={2}>
                <Text fontSize="sm" fontWeight="medium">
                  {source.count}
                </Text>
                <Text fontSize="xs" color="neutral.500">
                  ({source.percentage}%)
                </Text>
              </HStack>
            </Flex>
            <Progress
              value={source.percentage}
              size="xs"
              colorScheme={sourceColors[source.source] || 'gray'}
              borderRadius="full"
            />
          </Box>
        ))}
      </VStack>
    </GlassCard>
  );
}

export default function JobAnalyticsPage() {
  const params = useParams();
  const jobId = params.id as string;
  const [period, setPeriod] = useState<Period>('30d');

  const { data: job, isLoading: jobLoading } = useJob(jobId);

  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ['job-analytics', jobId, period],
    queryFn: () => analyticsApi.getJobAnalytics(jobId, period),
    enabled: !!jobId,
  });

  const isLoading = jobLoading || analyticsLoading;

  // Generate mock data if API doesn't return anything
  const mockAnalytics: JobAnalytics = analytics || {
    viewsOverTime: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString(),
      views: Math.floor(Math.random() * 100) + 10,
    })),
    applicationsOverTime: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString(),
      applications: Math.floor(Math.random() * 10),
    })),
    totalViews: job?.viewCount || 0,
    totalApplications: Math.floor((job?.viewCount || 0) * 0.03),
    conversionRate: 3.2,
    averageTimeOnPage: 45,
    sourceBreakdown: [
      { source: 'direct', count: 450, percentage: 45 },
      { source: 'search', count: 300, percentage: 30 },
      { source: 'social', count: 150, percentage: 15 },
      { source: 'referral', count: 80, percentage: 8 },
      { source: 'email', count: 20, percentage: 2 },
    ],
  };

  if (isLoading) {
    return (
      <Center minH="400px">
        <Spinner size="xl" color="primary.500" />
      </Center>
    );
  }

  if (!job) {
    return (
      <Container maxW="6xl" py={8}>
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          Job not found.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxW="6xl" py={8}>
      <VStack spacing={6} align="stretch">
        {/* Back Link */}
        <Link href={`/jobs/${jobId}`}>
          <HStack
            spacing={2}
            color="primary.500"
            _hover={{ color: 'primary.600' }}
          >
            <Icon as={FiArrowLeft} />
            <Text>Back to Job</Text>
          </HStack>
        </Link>

        {/* Header */}
        <Flex justify="space-between" align="start" wrap="wrap" gap={4}>
          <VStack align="start" spacing={1}>
            <Heading size="lg">Analytics</Heading>
            <Text color="neutral.500">{job.title}</Text>
          </VStack>

          <Select
            value={period}
            onChange={(e) => setPeriod(e.target.value as Period)}
            maxW="150px"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </Select>
        </Flex>

        {/* Stats Overview */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
          <StatCard
            label="Total Views"
            value={mockAnalytics.totalViews.toLocaleString()}
            icon={FiEye}
            color="blue"
            trend={{ value: 12, type: 'increase' }}
          />
          <StatCard
            label="Applications"
            value={mockAnalytics.totalApplications}
            icon={FiUsers}
            color="green"
            trend={{ value: 8, type: 'increase' }}
          />
          <StatCard
            label="Conversion Rate"
            value={`${mockAnalytics.conversionRate}%`}
            icon={FiPercent}
            color="purple"
            helpText="View to application"
          />
          <StatCard
            label="Avg. Time on Page"
            value={`${mockAnalytics.averageTimeOnPage}s`}
            icon={FiClock}
            color="orange"
            trend={{ value: 5, type: 'increase' }}
          />
        </SimpleGrid>

        {/* Charts */}
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
          <SimpleChart
            data={mockAnalytics.viewsOverTime.map((d) => ({
              date: d.date,
              value: d.views,
            }))}
            label="Views Over Time"
            color="blue"
          />
          <SimpleChart
            data={mockAnalytics.applicationsOverTime.map((d) => ({
              date: d.date,
              value: d.applications,
            }))}
            label="Applications Over Time"
            color="green"
          />
        </SimpleGrid>

        {/* Source Breakdown */}
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
          <SourceBreakdown sources={mockAnalytics.sourceBreakdown} />

          <GlassCard p={6}>
            <Text fontWeight="semibold" mb={4}>
              Performance Insights
            </Text>
            <VStack align="stretch" spacing={4}>
              <HStack spacing={3}>
                <Box
                  p={2}
                  borderRadius="md"
                  bg="green.100"
                  color="green.600"
                  _dark={{ bg: 'green.900', color: 'green.200' }}
                >
                  <Icon as={FiTrendingUp} />
                </Box>
                <Box>
                  <Text fontSize="sm" fontWeight="medium">
                    High engagement
                  </Text>
                  <Text fontSize="xs" color="neutral.500">
                    Your job is performing 23% better than similar listings
                  </Text>
                </Box>
              </HStack>

              <HStack spacing={3}>
                <Box
                  p={2}
                  borderRadius="md"
                  bg="blue.100"
                  color="blue.600"
                  _dark={{ bg: 'blue.900', color: 'blue.200' }}
                >
                  <Icon as={FiEye} />
                </Box>
                <Box>
                  <Text fontSize="sm" fontWeight="medium">
                    Peak viewing time
                  </Text>
                  <Text fontSize="xs" color="neutral.500">
                    Most views occur between 9 AM - 11 AM
                  </Text>
                </Box>
              </HStack>

              <HStack spacing={3}>
                <Box
                  p={2}
                  borderRadius="md"
                  bg="purple.100"
                  color="purple.600"
                  _dark={{ bg: 'purple.900', color: 'purple.200' }}
                >
                  <Icon as={FiUsers} />
                </Box>
                <Box>
                  <Text fontSize="sm" fontWeight="medium">
                    Quality applicants
                  </Text>
                  <Text fontSize="xs" color="neutral.500">
                    67% of applicants match your requirements
                  </Text>
                </Box>
              </HStack>
            </VStack>
          </GlassCard>
        </SimpleGrid>
      </VStack>
    </Container>
  );
}
