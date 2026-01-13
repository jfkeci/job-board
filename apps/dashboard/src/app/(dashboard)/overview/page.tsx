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
  Progress,
  GlassCard,
  GlassButton,
} from '@borg/ui';
import {
  FiTrendingUp,
  FiUsers,
  FiDollarSign,
  FiActivity,
  FiArrowUp,
  FiArrowDown,
} from 'react-icons/fi';

const stats = [
  {
    label: 'Total Revenue',
    value: '$45,231',
    change: '+20.1%',
    isPositive: true,
    icon: FiDollarSign,
  },
  {
    label: 'Active Users',
    value: '2,350',
    change: '+15.3%',
    isPositive: true,
    icon: FiUsers,
  },
  {
    label: 'Conversion Rate',
    value: '3.24%',
    change: '-2.1%',
    isPositive: false,
    icon: FiTrendingUp,
  },
  {
    label: 'Active Sessions',
    value: '1,247',
    change: '+8.5%',
    isPositive: true,
    icon: FiActivity,
  },
];

const recentActivity = [
  { action: 'New user signup', user: 'john@example.com', time: '2 minutes ago' },
  { action: 'Payment received', user: 'sarah@company.com', time: '15 minutes ago' },
  { action: 'Report generated', user: 'admin@example.com', time: '1 hour ago' },
  { action: 'Settings updated', user: 'mike@startup.io', time: '3 hours ago' },
  { action: 'New subscription', user: 'lisa@enterprise.com', time: '5 hours ago' },
];

const tasks = [
  { name: 'Review pending invoices', progress: 75, status: 'In Progress' },
  { name: 'Update team permissions', progress: 100, status: 'Completed' },
  { name: 'Prepare monthly report', progress: 30, status: 'In Progress' },
  { name: 'Onboard new team member', progress: 0, status: 'Not Started' },
];

export default function OverviewPage() {
  return (
    <VStack spacing={8} align="stretch">
      {/* Page Header */}
      <Box>
        <Heading as="h1" size="lg" mb={2}>
          Dashboard Overview
        </Heading>
        <Text color="neutral.600" _dark={{ color: 'neutral.400' }}>
          Welcome back! Here&apos;s what&apos;s happening with your business today.
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

      {/* Content Grid */}
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
        {/* Recent Activity */}
        <GlassCard p={6}>
          <VStack align="stretch" spacing={4}>
            <Flex justify="space-between" align="center">
              <Heading as="h3" size="md">
                Recent Activity
              </Heading>
              <GlassButton size="sm" variant="ghost">
                View All
              </GlassButton>
            </Flex>
            <VStack align="stretch" spacing={3} divider={<Box borderBottom="1px" borderColor="neutral.200" _dark={{ borderColor: 'neutral.700' }} />}>
              {recentActivity.map((activity, index) => (
                <Flex key={index} justify="space-between" align="center" py={2}>
                  <VStack align="start" spacing={0}>
                    <Text fontWeight="medium">{activity.action}</Text>
                    <Text fontSize="sm" color="neutral.500">
                      {activity.user}
                    </Text>
                  </VStack>
                  <Text fontSize="sm" color="neutral.500">
                    {activity.time}
                  </Text>
                </Flex>
              ))}
            </VStack>
          </VStack>
        </GlassCard>

        {/* Tasks Progress */}
        <GlassCard p={6}>
          <VStack align="stretch" spacing={4}>
            <Flex justify="space-between" align="center">
              <Heading as="h3" size="md">
                Tasks
              </Heading>
              <GlassButton size="sm" variant="ghost">
                View All
              </GlassButton>
            </Flex>
            <VStack align="stretch" spacing={4}>
              {tasks.map((task, index) => (
                <Box key={index}>
                  <Flex justify="space-between" align="center" mb={2}>
                    <Text fontWeight="medium">{task.name}</Text>
                    <Text
                      fontSize="sm"
                      color={
                        task.status === 'Completed'
                          ? 'green.500'
                          : task.status === 'In Progress'
                          ? 'primary.500'
                          : 'neutral.500'
                      }
                    >
                      {task.status}
                    </Text>
                  </Flex>
                  <Progress
                    value={task.progress}
                    size="sm"
                    colorScheme={task.progress === 100 ? 'green' : 'primary'}
                    borderRadius="full"
                    bg="neutral.200"
                    _dark={{ bg: 'neutral.700' }}
                  />
                </Box>
              ))}
            </VStack>
          </VStack>
        </GlassCard>
      </SimpleGrid>

      {/* Quick Actions */}
      <GlassCard p={6}>
        <VStack align="stretch" spacing={4}>
          <Heading as="h3" size="md">
            Quick Actions
          </Heading>
          <HStack spacing={4} flexWrap="wrap">
            <GlassButton>Create Report</GlassButton>
            <GlassButton variant="outline">Invite Team Member</GlassButton>
            <GlassButton variant="outline">View Analytics</GlassButton>
            <GlassButton variant="ghost">Settings</GlassButton>
          </HStack>
        </VStack>
      </GlassCard>
    </VStack>
  );
}
