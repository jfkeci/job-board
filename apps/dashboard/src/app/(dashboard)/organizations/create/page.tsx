'use client';

import { OrganizationSize } from '@job-board/types';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Icon,
  GlassCard,
  GlassButton,
  GlassInput,
} from '@job-board/ui';
import { Alert, AlertIcon, Select, Textarea } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FiBriefcase } from 'react-icons/fi';

import { useCreateOrganization } from '@/hooks/use-organizations';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';

interface FormErrors {
  name?: string;
  website?: string;
}

const organizationSizeLabels: Record<OrganizationSize, string> = {
  [OrganizationSize.STARTUP]: 'Startup (1-10 employees)',
  [OrganizationSize.SMALL]: 'Small (11-50 employees)',
  [OrganizationSize.MEDIUM]: 'Medium (51-200 employees)',
  [OrganizationSize.LARGE]: 'Large (201-500 employees)',
  [OrganizationSize.ENTERPRISE]: 'Enterprise (500+ employees)',
};

export default function CreateOrganizationPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const createOrganization = useCreateOrganization();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [website, setWebsite] = useState('');
  const [industry, setIndustry] = useState('');
  const [size, setSize] = useState<OrganizationSize | ''>('');
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!name.trim()) {
      newErrors.name = 'Organization name is required';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Organization name must be at least 2 characters';
    }

    if (website && !isValidUrl(website)) {
      newErrors.website =
        'Please enter a valid URL (e.g., https://example.com)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await createOrganization.mutateAsync({
        name: name.trim(),
        description: description.trim() || undefined,
        website: website.trim() || undefined,
        industry: industry.trim() || undefined,
        size: size || undefined,
      });

      // Refetch user to get updated organizationId
      try {
        const updatedUser = await authApi.me();
        setUser(updatedUser);
      } catch {
        // If refetch fails, still proceed - the guard will handle it
      }

      router.push('/overview');
    } catch {
      // Error is handled by the mutation
    }
  };

  return (
    <Container maxW="2xl" py={8}>
      <GlassCard p={{ base: 8, md: 10 }}>
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <VStack spacing={4} textAlign="center">
            <Box
              w={16}
              h={16}
              bg="primary.100"
              _dark={{ bg: 'primary.900' }}
              borderRadius="full"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Icon as={FiBriefcase} w={8} h={8} color="primary.500" />
            </Box>
            <VStack spacing={2}>
              <Heading as="h1" size="lg">
                Create Your Organization
              </Heading>
              <Text color="neutral.600" _dark={{ color: 'neutral.400' }}>
                Set up your company profile to start posting jobs
              </Text>
            </VStack>
          </VStack>

          {/* Error Alert */}
          {createOrganization.error && (
            <Alert status="error" borderRadius="md">
              <AlertIcon />
              {createOrganization.error instanceof Error
                ? createOrganization.error.message
                : 'Failed to create organization'}
            </Alert>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <VStack spacing={5} align="stretch">
              {/* Organization Name */}
              <FormControl isRequired isInvalid={!!errors.name}>
                <FormLabel>Organization Name</FormLabel>
                <GlassInput
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Acme Corporation"
                />
                <FormErrorMessage>{errors.name}</FormErrorMessage>
              </FormControl>

              {/* Description */}
              <FormControl>
                <FormLabel>Description</FormLabel>
                <Textarea
                  value={description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setDescription(e.target.value)
                  }
                  placeholder="Tell us about your company..."
                  rows={4}
                  bg="transparent"
                  borderColor="glass.light.border"
                  _dark={{ borderColor: 'glass.dark.border' }}
                  _hover={{
                    borderColor: 'primary.300',
                  }}
                  _focus={{
                    borderColor: 'primary.500',
                    boxShadow: '0 0 0 1px var(--chakra-colors-primary-500)',
                  }}
                />
              </FormControl>

              {/* Website */}
              <FormControl isInvalid={!!errors.website}>
                <FormLabel>Website</FormLabel>
                <GlassInput
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://www.example.com"
                />
                <FormErrorMessage>{errors.website}</FormErrorMessage>
              </FormControl>

              {/* Industry */}
              <FormControl>
                <FormLabel>Industry</FormLabel>
                <GlassInput
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  placeholder="Technology, Healthcare, Finance..."
                />
              </FormControl>

              {/* Company Size */}
              <FormControl>
                <FormLabel>Company Size</FormLabel>
                <Select
                  value={size}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setSize(e.target.value as OrganizationSize | '')
                  }
                  placeholder="Select company size..."
                  bg="transparent"
                  borderColor="glass.light.border"
                  _dark={{ borderColor: 'glass.dark.border' }}
                  _hover={{
                    borderColor: 'primary.300',
                  }}
                  _focus={{
                    borderColor: 'primary.500',
                    boxShadow: '0 0 0 1px var(--chakra-colors-primary-500)',
                  }}
                >
                  {Object.entries(organizationSizeLabels).map(
                    ([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ),
                  )}
                </Select>
              </FormControl>

              {/* Submit Button */}
              <GlassButton
                type="submit"
                colorScheme="primary"
                size="lg"
                w="full"
                isLoading={createOrganization.isPending}
                loadingText="Creating..."
                mt={4}
              >
                Create Organization
              </GlassButton>
            </VStack>
          </form>
        </VStack>
      </GlassCard>
    </Container>
  );
}
