'use client';

import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  SimpleGrid,
  List,
  ListItem,
  ListIcon,
  Badge,
  Icon,
  GlassCard,
  GlassButton,
} from '@job-board/ui';
import Link from 'next/link';
import { FiCheck, FiLinkedin, FiInstagram, FiFacebook } from 'react-icons/fi';

import { MainLayout } from '@/components/layout';

const plans = [
  {
    name: 'Basic',
    price: '€68',
    period: '/posting',
    description: 'Standard job posting to get started.',
    features: [
      'Standard job posting',
      'Unlimited description length',
      '30-day listing duration',
      'Basic applicant notifications',
    ],
    highlighted: false,
    cta: 'Post a Job',
  },
  {
    name: 'Standard',
    price: '€387',
    period: '/posting',
    description: 'Enhanced visibility with CV access.',
    features: [
      'Highlighted company logo',
      'Access to 10 candidate CVs',
      'Unlimited description length',
      '30-day listing duration',
      'Applicant tracking',
    ],
    highlighted: false,
    cta: 'Post a Job',
  },
  {
    name: 'Premium',
    price: '€570',
    period: '/posting',
    description: 'Best visibility for competitive roles.',
    features: [
      'All Standard features',
      'Enhanced search visibility',
      'Featured in category listings',
      'Priority in search results',
      'Extended analytics',
    ],
    highlighted: true,
    cta: 'Post a Job',
    badge: 'Most Popular',
  },
  {
    name: 'Exclusive',
    price: '€1,022',
    period: '/posting',
    description: 'Maximum exposure for critical hires.',
    features: [
      'All Premium features',
      'Maximum visibility & placement',
      'Featured position in categories',
      'Priority support',
      'Dedicated account manager',
      'Custom branding options',
    ],
    highlighted: false,
    cta: 'Contact Sales',
  },
];

const addons = [
  {
    name: 'LinkedIn',
    price: '€50',
    icon: FiLinkedin,
    description: 'Reach passive professional candidates',
  },
  {
    name: 'Instagram',
    price: '€50',
    icon: FiInstagram,
    description: 'Target younger, active audience',
  },
  {
    name: 'Facebook',
    price: '€50',
    icon: FiFacebook,
    description: 'Broad reach on the most popular social network',
  },
];

export default function PricingPage() {
  return (
    <MainLayout>
      {/* Header Section */}
      <Box py={{ base: 16, md: 24 }}>
        <Container maxW="container.xl">
          <VStack spacing={6} textAlign="center" maxW="3xl" mx="auto">
            <Heading
              as="h1"
              size={{ base: 'xl', md: '2xl' }}
              bgGradient="linear(to-r, primary.500, primary.600)"
              bgClip="text"
            >
              Job Advertisement Pricing
            </Heading>
            <Text
              fontSize={{ base: 'lg', md: 'xl' }}
              color="neutral.600"
              _dark={{ color: 'neutral.400' }}
            >
              Choose the perfect tier for your hiring needs. Reach qualified
              candidates with our transparent, pay-per-posting pricing.
            </Text>
          </VStack>
        </Container>
      </Box>

      {/* Pricing Cards */}
      <Box pb={{ base: 16, md: 24 }}>
        <Container maxW="container.xl">
          <SimpleGrid columns={{ base: 1, md: 2, xl: 4 }} spacing={6}>
            {plans.map((plan) => (
              <GlassCard
                key={plan.name}
                p={6}
                position="relative"
                primaryTint={plan.highlighted}
              >
                {plan.badge && (
                  <Badge
                    position="absolute"
                    top={-3}
                    right={4}
                    bg="primary.500"
                    color="white"
                    px={3}
                    py={1}
                    borderRadius="full"
                    fontSize="sm"
                  >
                    {plan.badge}
                  </Badge>
                )}

                <VStack align="stretch" spacing={5}>
                  {/* Plan Header */}
                  <VStack align="start" spacing={1}>
                    <Heading as="h3" size="md">
                      {plan.name}
                    </Heading>
                    <Text
                      fontSize="sm"
                      color="neutral.600"
                      _dark={{ color: 'neutral.400' }}
                    >
                      {plan.description}
                    </Text>
                  </VStack>

                  {/* Price */}
                  <HStack align="baseline" spacing={1}>
                    <Text fontSize="3xl" fontWeight="bold">
                      {plan.price}
                    </Text>
                    <Text fontSize="sm" color="neutral.500">
                      {plan.period}
                    </Text>
                  </HStack>

                  {/* Features */}
                  <List spacing={2} flex="1">
                    {plan.features.map((feature, index) => (
                      <ListItem
                        key={index}
                        display="flex"
                        alignItems="flex-start"
                      >
                        <ListIcon
                          as={FiCheck}
                          color="primary.500"
                          boxSize={4}
                          mt={1}
                        />
                        <Text fontSize="sm">{feature}</Text>
                      </ListItem>
                    ))}
                  </List>

                  {/* CTA Button */}
                  <Link href="/login">
                    <GlassButton
                      w="full"
                      size="md"
                      variant={plan.highlighted ? 'solid' : 'outline'}
                    >
                      {plan.cta}
                    </GlassButton>
                  </Link>
                </VStack>
              </GlassCard>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* Promotional Add-ons Section */}
      <Box
        py={{ base: 16, md: 24 }}
        bg="glass.light.surface"
        _dark={{ bg: 'glass.dark.surface' }}
      >
        <Container maxW="container.xl">
          <VStack spacing={10}>
            <VStack spacing={4} textAlign="center">
              <Heading as="h2" size="xl">
                Promotional Add-ons
              </Heading>
              <Text
                fontSize="lg"
                color="neutral.600"
                _dark={{ color: 'neutral.400' }}
                maxW="2xl"
              >
                Extend your reach with social media promotion. Add-ons can be
                combined with any tier for maximum exposure.
              </Text>
            </VStack>

            <SimpleGrid
              columns={{ base: 1, md: 3 }}
              spacing={6}
              w="full"
              maxW="4xl"
            >
              {addons.map((addon) => (
                <GlassCard key={addon.name} p={6}>
                  <HStack spacing={4}>
                    <Box
                      p={3}
                      bg="primary.50"
                      borderRadius="lg"
                      color="primary.500"
                      _dark={{ bg: 'rgba(99, 102, 241, 0.2)' }}
                    >
                      <Icon as={addon.icon} boxSize={6} />
                    </Box>
                    <VStack align="start" spacing={0} flex="1">
                      <HStack justify="space-between" w="full">
                        <Text fontWeight="semibold">{addon.name}</Text>
                        <Text fontWeight="bold" color="primary.500">
                          +{addon.price}
                        </Text>
                      </HStack>
                      <Text
                        fontSize="sm"
                        color="neutral.600"
                        _dark={{ color: 'neutral.400' }}
                      >
                        {addon.description}
                      </Text>
                    </VStack>
                  </HStack>
                </GlassCard>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* Contact Section */}
      <Box py={{ base: 16, md: 24 }}>
        <Container maxW="container.lg">
          <GlassCard p={{ base: 8, md: 12 }}>
            <VStack spacing={6} textAlign="center">
              <Heading as="h2" size="xl">
                Need bulk posting discounts?
              </Heading>
              <Text
                fontSize="lg"
                color="neutral.600"
                _dark={{ color: 'neutral.400' }}
                maxW="xl"
              >
                For recruitment agencies and high-volume employers, we offer
                custom pricing packages tailored to your hiring needs.
              </Text>
              <HStack spacing={4}>
                <Link href="/contact">
                  <GlassButton size="lg">Contact Sales</GlassButton>
                </Link>
                <Link href="/dashboard/overview">
                  <GlassButton size="lg" variant="ghost">
                    View Dashboard
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
