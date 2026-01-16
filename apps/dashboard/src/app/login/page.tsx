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
  FormErrorMessage,
  Checkbox,
  GlassCard,
  GlassButton,
  GlassInput,
  GlassAlert,
} from '@job-board/ui';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

import { useAuthStore } from '@/store/auth.store';
import { env } from '@/lib/env';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error, clearError, isAuthenticated, isHydrated } =
    useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Redirect if already authenticated
  useEffect(() => {
    if (isHydrated && isAuthenticated) {
      router.push('/jobs/create');
    }
  }, [isHydrated, isAuthenticated, router]);

  // Clear store error when component unmounts
  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  const validateForm = (): boolean => {
    let isValid = true;
    setEmailError('');
    setPasswordError('');

    if (!email) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    }

    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!validateForm()) return;

    try {
      await login({
        email,
        password,
        tenantId: env.NEXT_PUBLIC_DEFAULT_TENANT_ID,
      });
      router.push('/jobs/create');
    } catch {
      // Error is handled by store
    }
  };

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

            {/* Error Alert */}
            {error && (
              <GlassAlert
                status="error"
                title={error}
                description="Please verify your credentials and try again"
                isClosable
                onClose={clearError}
              />
            )}

            {/* Login Form */}
            <VStack as="form" spacing={4} w="full" onSubmit={handleSubmit}>
              <FormControl isInvalid={!!emailError}>
                <FormLabel>Email</FormLabel>
                <GlassInput
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <FormErrorMessage>{emailError}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!passwordError}>
                <FormLabel>Password</FormLabel>
                <GlassInput
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <FormErrorMessage>{passwordError}</FormErrorMessage>
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

              <GlassButton
                w="full"
                size="lg"
                type="submit"
                isLoading={isLoading}
                loadingText="Signing in..."
              >
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
