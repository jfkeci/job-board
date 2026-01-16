"use client";

import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  GlassCard,
  GlassInput,
  GlassButton,
  FormControl,
  FormLabel,
  FormErrorMessage,
  useToast,
} from "@job-board/ui";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useAuthStore } from "@/store/auth.store";

export default function LoginPage() {
  const router = useRouter();
  const toast = useToast();
  const { login, isLoading, error, clearError } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formErrors, setFormErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const validate = () => {
    const errors: { email?: string; password?: string } = {};

    if (!email) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Invalid email format";
    }

    if (!password) {
      errors.password = "Password is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!validate()) return;

    try {
      await login({ email, password, tenantId: "default" });
      toast({
        title: "Welcome back!",
        status: "success",
        duration: 3000,
      });
      router.push("/dashboard");
    } catch {
      // Error is handled by the store
    }
  };

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="gray.900"
      py={12}
    >
      <Container maxW="md">
        <GlassCard p={8}>
          <VStack spacing={6} align="stretch">
            <VStack spacing={2} textAlign="center">
              <Heading size="lg" color="white">
                Admin Login
              </Heading>
              <Text color="whiteAlpha.700">
                Sign in to access the admin dashboard
              </Text>
            </VStack>

            {error && (
              <Box
                bg="red.500"
                color="white"
                px={4}
                py={3}
                borderRadius="md"
                fontSize="sm"
              >
                {error}
              </Box>
            )}

            <form onSubmit={handleSubmit}>
              <VStack spacing={4}>
                <FormControl isInvalid={!!formErrors.email}>
                  <FormLabel color="whiteAlpha.800">Email</FormLabel>
                  <GlassInput
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@example.com"
                  />
                  <FormErrorMessage>{formErrors.email}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!formErrors.password}>
                  <FormLabel color="whiteAlpha.800">Password</FormLabel>
                  <GlassInput
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                  />
                  <FormErrorMessage>{formErrors.password}</FormErrorMessage>
                </FormControl>

                <GlassButton
                  type="submit"
                  variant="solid"
                  width="full"
                  isLoading={isLoading}
                  mt={4}
                >
                  Sign In
                </GlassButton>
              </VStack>
            </form>
          </VStack>
        </GlassCard>
      </Container>
    </Box>
  );
}
