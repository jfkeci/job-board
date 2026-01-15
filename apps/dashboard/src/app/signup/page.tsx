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
} from '@borg/ui';
import { Alert, AlertIcon } from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

import { useAuthStore } from '@/store/auth.store';

// Default tenant ID for MVP - will be dynamic later
const DEFAULT_TENANT_ID =
  process.env.NEXT_PUBLIC_DEFAULT_TENANT_ID ||
  '00000000-0000-0000-0000-000000000001';

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  terms?: string;
}

export default function SignupPage() {
  const router = useRouter();
  const { register, isLoading, error, clearError, isAuthenticated, isHydrated } =
    useAuthStore();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

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
    const newErrors: FormErrors = {};

    if (!firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!acceptTerms) {
      newErrors.terms = 'You must accept the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!validateForm()) return;

    try {
      await register({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email,
        password,
        tenantId: DEFAULT_TENANT_ID,
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
          <VStack spacing={6}>
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
                Create your account
              </Heading>
              <Text color="neutral.600" _dark={{ color: 'neutral.400' }}>
                Start hiring top talent today
              </Text>
            </VStack>

            {/* Error Alert */}
            {error && (
              <Alert status="error" borderRadius="md">
                <AlertIcon />
                {error}
              </Alert>
            )}

            {/* Signup Form */}
            <VStack as="form" spacing={4} w="full" onSubmit={handleSubmit}>
              <HStack w="full" spacing={4}>
                <FormControl isInvalid={!!errors.firstName}>
                  <FormLabel>First name</FormLabel>
                  <GlassInput
                    placeholder="John"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                  <FormErrorMessage>{errors.firstName}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.lastName}>
                  <FormLabel>Last name</FormLabel>
                  <GlassInput
                    placeholder="Doe"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                  <FormErrorMessage>{errors.lastName}</FormErrorMessage>
                </FormControl>
              </HStack>

              <FormControl isInvalid={!!errors.email}>
                <FormLabel>Email</FormLabel>
                <GlassInput
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <FormErrorMessage>{errors.email}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.password}>
                <FormLabel>Password</FormLabel>
                <GlassInput
                  type="password"
                  placeholder="Minimum 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <FormErrorMessage>{errors.password}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.confirmPassword}>
                <FormLabel>Confirm password</FormLabel>
                <GlassInput
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.terms}>
                <Checkbox
                  colorScheme="primary"
                  isChecked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                >
                  <Text fontSize="sm">
                    I agree to the{' '}
                    <Text as="span" color="primary.500">
                      Terms of Service
                    </Text>{' '}
                    and{' '}
                    <Text as="span" color="primary.500">
                      Privacy Policy
                    </Text>
                  </Text>
                </Checkbox>
                <FormErrorMessage>{errors.terms}</FormErrorMessage>
              </FormControl>

              <GlassButton
                w="full"
                size="lg"
                type="submit"
                isLoading={isLoading}
                loadingText="Creating account..."
              >
                Create Account
              </GlassButton>
            </VStack>

            {/* Sign In Link */}
            <Text color="neutral.600" _dark={{ color: 'neutral.400' }}>
              Already have an account?{' '}
              <Link href="/login">
                <Text
                  as="span"
                  color="primary.500"
                  fontWeight="medium"
                  _hover={{ textDecoration: 'underline' }}
                >
                  Sign in
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
