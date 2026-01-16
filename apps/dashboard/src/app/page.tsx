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
  Badge,
  GlassCard,
  GlassButton,
} from '@job-board/ui';
import Link from 'next/link';
import {
  FiBriefcase,
  FiUsers,
  FiDatabase,
  FiTrendingUp,
  FiCheck,
  FiZap,
  FiShare2,
} from 'react-icons/fi';

import { MainLayout } from '@/components/layout';

// =============================================================================
// Data
// =============================================================================

const features = [
  {
    icon: FiBriefcase,
    title: 'Easy Job Posting',
    description:
      'Create and publish job listings in minutes with our intuitive interface.',
  },
  {
    icon: FiUsers,
    title: 'Applicant Tracking',
    description:
      'Manage all applications in one place. Review, shortlist, and hire efficiently.',
  },
  {
    icon: FiDatabase,
    title: 'CV Database Access',
    description:
      'Search our database of qualified candidates and reach out proactively.',
  },
  {
    icon: FiTrendingUp,
    title: 'Performance Analytics',
    description:
      'Track views, applications, and conversion rates for every job post.',
  },
];

const pricingTiers = [
  {
    name: 'Basic',
    price: '€68',
    description: 'Standard job posting',
    features: [
      'Unlimited description length',
      '30-day listing',
      'Basic visibility',
    ],
    color: 'gray',
  },
  {
    name: 'Standard',
    price: '€387',
    description: 'Enhanced recruitment',
    features: [
      'All Basic features',
      'Highlighted company logo',
      'Access to 10 CVs',
    ],
    color: 'blue',
    popular: true,
  },
  {
    name: 'Premium',
    price: '€570',
    description: 'Maximum visibility',
    features: [
      'All Standard features',
      'Enhanced search visibility',
      'Priority placement',
    ],
    color: 'purple',
  },
];

const socialAddons = [
  { name: 'LinkedIn', price: '+€50' },
  { name: 'Instagram', price: '+€50' },
  { name: 'Facebook', price: '+€50' },
];

// =============================================================================
// Component
// =============================================================================

export default function HomePage() {
  return (
    <MainLayout>
      {/* Hero Section */}
      <Box py={{ base: 16, md: 24 }} position="relative" overflow="hidden">
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
                <Badge colorScheme="primary" fontSize="sm" px={3} py={1}>
                  For Employers
                </Badge>
                <Heading
                  as="h1"
                  size={{ base: 'xl', md: '2xl' }}
                  bgGradient="linear(to-r, primary.500, primary.600)"
                  bgClip="text"
                >
                  Find Your Next Great Hire
                </Heading>
                <Text
                  fontSize={{ base: 'lg', md: 'xl' }}
                  color="neutral.600"
                  _dark={{ color: 'neutral.400' }}
                  maxW="2xl"
                >
                  Post job listings, access qualified candidates, and manage
                  your recruitment process all in one powerful platform.
                </Text>
                <HStack spacing={4} pt={4} flexWrap="wrap" justify="center">
                  <Link href="/signup">
                    <GlassButton size="lg" leftIcon={<FiZap />}>
                      Post a Job
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
      <Box py={{ base: 12, md: 16 }}>
        <Container maxW="container.xl">
          <VStack spacing={12}>
            <VStack spacing={4} textAlign="center">
              <Heading as="h2" size="lg">
                Everything You Need to Hire
              </Heading>
              <Text
                color="neutral.600"
                _dark={{ color: 'neutral.400' }}
                maxW="2xl"
              >
                Streamline your recruitment process with powerful tools designed
                for modern hiring.
              </Text>
            </VStack>

            <SimpleGrid
              columns={{ base: 1, md: 2, lg: 4 }}
              spacing={6}
              w="full"
            >
              {features.map((feature, index) => (
                <GlassCard key={index} p={6}>
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
                    <Heading as="h3" size="sm">
                      {feature.title}
                    </Heading>
                    <Text
                      fontSize="sm"
                      color="neutral.600"
                      _dark={{ color: 'neutral.400' }}
                    >
                      {feature.description}
                    </Text>
                  </VStack>
                </GlassCard>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* Pricing Preview Section */}
      <Box
        py={{ base: 12, md: 16 }}
        bg="neutral.50"
        _dark={{ bg: 'rgba(255,255,255,0.02)' }}
      >
        <Container maxW="container.xl">
          <VStack spacing={12}>
            <VStack spacing={4} textAlign="center">
              <Heading as="h2" size="lg">
                Simple, Transparent Pricing
              </Heading>
              <Text
                color="neutral.600"
                _dark={{ color: 'neutral.400' }}
                maxW="2xl"
              >
                Choose the tier that fits your hiring needs. No hidden fees.
              </Text>
            </VStack>

            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} w="full">
              {pricingTiers.map((tier, index) => (
                <GlassCard
                  key={index}
                  p={6}
                  borderWidth={tier.popular ? '2px' : '1px'}
                  borderColor={tier.popular ? 'primary.500' : 'transparent'}
                  position="relative"
                >
                  {tier.popular && (
                    <Badge
                      colorScheme="primary"
                      position="absolute"
                      top={-3}
                      left="50%"
                      transform="translateX(-50%)"
                      px={3}
                      py={1}
                    >
                      Most Popular
                    </Badge>
                  )}
                  <VStack align="stretch" spacing={4}>
                    <VStack align="start" spacing={1}>
                      <Badge
                        colorScheme={tier.color}
                        textTransform="capitalize"
                      >
                        {tier.name}
                      </Badge>
                      <HStack align="baseline" spacing={1}>
                        <Heading as="h3" size="xl">
                          {tier.price}
                        </Heading>
                        <Text color="neutral.500" fontSize="sm">
                          / job post
                        </Text>
                      </HStack>
                      <Text
                        fontSize="sm"
                        color="neutral.600"
                        _dark={{ color: 'neutral.400' }}
                      >
                        {tier.description}
                      </Text>
                    </VStack>
                    <VStack align="start" spacing={2} pt={2}>
                      {tier.features.map((feature, fIndex) => (
                        <HStack key={fIndex} spacing={2}>
                          <Icon as={FiCheck} color="green.500" boxSize={4} />
                          <Text fontSize="sm">{feature}</Text>
                        </HStack>
                      ))}
                    </VStack>
                  </VStack>
                </GlassCard>
              ))}
            </SimpleGrid>

            {/* Social Add-ons */}
            <GlassCard p={6} w="full" maxW="2xl">
              <VStack spacing={4}>
                <HStack spacing={2}>
                  <Icon as={FiShare2} color="primary.500" />
                  <Heading as="h3" size="sm">
                    Social Media Promotion Add-ons
                  </Heading>
                </HStack>
                <Text
                  fontSize="sm"
                  color="neutral.600"
                  _dark={{ color: 'neutral.400' }}
                  textAlign="center"
                >
                  Extend your reach with optional social media promotions
                </Text>
                <HStack spacing={4} flexWrap="wrap" justify="center">
                  {socialAddons.map((addon, index) => (
                    <Badge
                      key={index}
                      colorScheme="blue"
                      px={3}
                      py={1}
                      fontSize="sm"
                    >
                      {addon.name} {addon.price}
                    </Badge>
                  ))}
                </HStack>
              </VStack>
            </GlassCard>

            <Link href="/pricing">
              <GlassButton size="lg" variant="outline">
                View Full Pricing Details
              </GlassButton>
            </Link>
          </VStack>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box py={{ base: 12, md: 16 }}>
        <Container maxW="container.xl">
          <GlassCard p={{ base: 8, md: 12 }}>
            <VStack spacing={6} textAlign="center">
              <Heading as="h2" size="lg">
                Ready to Start Hiring?
              </Heading>
              <Text
                fontSize="lg"
                color="neutral.600"
                _dark={{ color: 'neutral.400' }}
                maxW="xl"
              >
                Join hundreds of companies finding great talent through our
                platform. Post your first job today.
              </Text>
              <HStack spacing={4} pt={4} flexWrap="wrap" justify="center">
                <Link href="/signup">
                  <GlassButton size="lg" leftIcon={<FiBriefcase />}>
                    Create Employer Account
                  </GlassButton>
                </Link>
                <Link href="/login">
                  <GlassButton size="lg" variant="outline">
                    Sign In
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
