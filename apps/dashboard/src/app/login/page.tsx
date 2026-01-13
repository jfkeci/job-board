'use client';

import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  FormControl,
  FormLabel,
  Divider,
  Checkbox,
  GlassCard,
  GlassButton,
  GlassInput,
} from '@borg/ui';
import Link from 'next/link';
import { FcGoogle } from 'react-icons/fc';
import { FiGithub } from 'react-icons/fi';

export default function LoginPage() {
  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="neutral.50"
      _dark={{ bg: 'neutral.950' }}
      py={12}
      px={4}
    >
      {/* Background gradient */}
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        bg="linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.05) 50%, transparent 100%)"
        pointerEvents="none"
      />

      <Container maxW="md" position="relative">
        <GlassCard p={{ base: 8, md: 10 }}>
          <VStack spacing={8}>
            {/* Header */}
            <VStack spacing={2} textAlign="center">
              <Link href="/">
                <HStack spacing={2} justify="center" mb={2}>
                  <Box
                    w={10}
                    h={10}
                    bg="primary.500"
                    borderRadius="lg"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    color="white"
                    fontWeight="bold"
                    fontSize="lg"
                  >
                    B
                  </Box>
                </HStack>
              </Link>
              <Heading as="h1" size="lg">
                Welcome back
              </Heading>
              <Text color="neutral.600" _dark={{ color: 'neutral.400' }}>
                Sign in to your account to continue
              </Text>
            </VStack>

            {/* Social Login Buttons */}
            <VStack spacing={3} w="full">
              <GlassButton
                w="full"
                variant="glass"
                leftIcon={<FcGoogle size={20} />}
              >
                Continue with Google
              </GlassButton>
              <GlassButton
                w="full"
                variant="glass"
                leftIcon={<FiGithub size={20} />}
              >
                Continue with GitHub
              </GlassButton>
            </VStack>

            {/* Divider */}
            <HStack w="full">
              <Divider />
              <Text
                px={3}
                color="neutral.500"
                fontSize="sm"
                whiteSpace="nowrap"
              >
                or continue with email
              </Text>
              <Divider />
            </HStack>

            {/* Login Form */}
            <VStack as="form" spacing={4} w="full">
              <FormControl>
                <FormLabel>Email</FormLabel>
                <GlassInput
                  type="email"
                  placeholder="you@example.com"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Password</FormLabel>
                <GlassInput
                  type="password"
                  placeholder="Enter your password"
                />
              </FormControl>

              <HStack w="full" justify="space-between">
                <Checkbox colorScheme="primary">
                  <Text fontSize="sm">Remember me</Text>
                </Checkbox>
                <Link href="/forgot-password">
                  <Text
                    fontSize="sm"
                    color="primary.500"
                    _hover={{ textDecoration: 'underline' }}
                  >
                    Forgot password?
                  </Text>
                </Link>
              </HStack>

              <GlassButton w="full" size="lg" type="submit">
                Sign In
              </GlassButton>
            </VStack>

            {/* Sign Up Link */}
            <Text color="neutral.600" _dark={{ color: 'neutral.400' }}>
              Don&apos;t have an account?{' '}
              <Link href="/signup">
                <Text
                  as="span"
                  color="primary.500"
                  fontWeight="medium"
                  _hover={{ textDecoration: 'underline' }}
                >
                  Sign up
                </Text>
              </Link>
            </Text>
          </VStack>
        </GlassCard>

        {/* Back to Home */}
        <Box textAlign="center" mt={6}>
          <Link href="/">
            <Text
              fontSize="sm"
              color="neutral.500"
              _hover={{ color: 'primary.500' }}
            >
              &larr; Back to home
            </Text>
          </Link>
        </Box>
      </Container>
    </Box>
  );
}
