'use client';

import {
  Box,
  Container,
  Heading,
  Text,
  HStack,
  VStack,
  SimpleGrid,
  Icon,
  GlassCard,
  GlassButton,
} from '@borg/ui';
import Link from 'next/link';
import { FiBarChart2, FiUsers, FiShield, FiZap } from 'react-icons/fi';

import { MainLayout } from '@/components/layout';

const features = [
  {
    icon: FiBarChart2,
    title: 'Advanced Analytics',
    description: 'Gain deep insights into your business performance with our powerful analytics tools.',
  },
  {
    icon: FiUsers,
    title: 'Team Management',
    description: 'Easily manage your team members, roles, and permissions all in one place.',
  },
  {
    icon: FiShield,
    title: 'Enterprise Security',
    description: 'Bank-level security with end-to-end encryption and compliance certifications.',
  },
  {
    icon: FiZap,
    title: 'Lightning Fast',
    description: 'Optimized for performance with instant data updates and real-time collaboration.',
  },
];

export default function HomePage() {
  return (
    <MainLayout>
      {/* Hero Section */}
      <Box
        py={{ base: 16, md: 24 }}
        position="relative"
        overflow="hidden"
      >
        {/* Background gradient */}
        <Box
          position="absolute"
          top="-50%"
          left="-20%"
          w="140%"
          h="200%"
          bg="linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.05) 50%, transparent 100%)"
          transform="rotate(-12deg)"
          pointerEvents="none"
        />

        <Container maxW="container.xl" position="relative">
          <VStack spacing={8} textAlign="center" maxW="3xl" mx="auto">
            <GlassCard p={{ base: 8, md: 12 }} w="full">
              <VStack spacing={6}>
                <Heading
                  as="h1"
                  size={{ base: 'xl', md: '2xl' }}
                  bgGradient="linear(to-r, primary.500, primary.600)"
                  bgClip="text"
                >
                  Welcome to Borg Dashboard
                </Heading>
                <Text
                  fontSize={{ base: 'lg', md: 'xl' }}
                  color="neutral.600"
                  _dark={{ color: 'neutral.400' }}
                  maxW="2xl"
                >
                  The powerful B2B platform that helps you manage your business,
                  track performance, and grow your revenue.
                </Text>
                <HStack spacing={4} pt={4} flexWrap="wrap" justify="center">
                  <Link href="/dashboard/overview">
                    <GlassButton size="lg">
                      Go to Dashboard
                    </GlassButton>
                  </Link>
                  <Link href="/pricing">
                    <GlassButton size="lg" variant="outline">
                      View Pricing
                    </GlassButton>
                  </Link>
                </HStack>
              </VStack>
            </GlassCard>
          </VStack>
        </Container>
      </Box>

      {/* Features Section */}
      <Box py={{ base: 16, md: 24 }}>
        <Container maxW="container.xl">
          <VStack spacing={12}>
            <VStack spacing={4} textAlign="center">
              <Heading as="h2" size="xl">
                Everything you need to succeed
              </Heading>
              <Text
                fontSize="lg"
                color="neutral.600"
                _dark={{ color: 'neutral.400' }}
                maxW="2xl"
              >
                Our platform provides all the tools and features you need to
                manage and grow your business effectively.
              </Text>
            </VStack>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} w="full">
              {features.map((feature, index) => (
                <GlassCard key={index} p={6} interactive>
                  <VStack align="start" spacing={4}>
                    <Box
                      p={3}
                      bg="primary.50"
                      borderRadius="lg"
                      color="primary.500"
                      _dark={{ bg: 'rgba(99, 102, 241, 0.2)' }}
                    >
                      <Icon as={feature.icon} boxSize={6} />
                    </Box>
                    <Heading as="h3" size="md">
                      {feature.title}
                    </Heading>
                    <Text color="neutral.600" _dark={{ color: 'neutral.400' }}>
                      {feature.description}
                    </Text>
                  </VStack>
                </GlassCard>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box py={{ base: 16, md: 24 }}>
        <Container maxW="container.lg">
          <GlassCard p={{ base: 8, md: 12 }} primaryTint>
            <VStack spacing={6} textAlign="center">
              <Heading as="h2" size="xl">
                Ready to get started?
              </Heading>
              <Text
                fontSize="lg"
                color="neutral.600"
                _dark={{ color: 'neutral.400' }}
                maxW="xl"
              >
                Join thousands of businesses already using Borg Dashboard
                to streamline their operations.
              </Text>
              <HStack spacing={4} pt={2}>
                <Link href="/login">
                  <GlassButton size="lg">
                    Start Free Trial
                  </GlassButton>
                </Link>
                <Link href="/contact">
                  <GlassButton size="lg" variant="ghost">
                    Contact Sales
                  </GlassButton>
                </Link>
              </HStack>
            </VStack>
          </GlassCard>
        </Container>
      </Box>
    </MainLayout>
  );
}
