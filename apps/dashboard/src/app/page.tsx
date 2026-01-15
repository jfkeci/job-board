'use client';

import {
  Box,
  Container,
  Heading,
  Text,
  HStack,
  VStack,
  GlassCard,
  GlassButton,
} from '@borg/ui';
import Link from 'next/link';

import { MainLayout } from '@/components/layout';

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

    </MainLayout>
  );
}
