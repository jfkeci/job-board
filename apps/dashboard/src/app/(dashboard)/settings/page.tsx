'use client';

import { OrganizationSize } from '@job-board/types';
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
  Icon,
  Spinner,
  Center,
  Badge,
  GlassCard,
  GlassButton,
  GlassInput,
  GlassAlert,
} from '@job-board/ui';
import { Select, Textarea } from '@chakra-ui/react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { FiBriefcase, FiCheck, FiSave } from 'react-icons/fi';

import { organizationsApi, type UpdateOrganizationData } from '@/lib/api';
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

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const organizationId = user?.organizationId;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [website, setWebsite] = useState('');
  const [industry, setIndustry] = useState('');
  const [size, setSize] = useState<OrganizationSize | ''>('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Fetch organization data
  const { data: organization, isLoading } = useQuery({
    queryKey: ['organization', organizationId],
    queryFn: () => organizationsApi.get(organizationId!),
    enabled: !!organizationId,
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: UpdateOrganizationData) =>
      organizationsApi.update(organizationId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['organization', organizationId],
      });
      setSuccessMessage('Organization settings saved successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    },
  });

  // Populate form when data loads
  useEffect(() => {
    if (organization) {
      setName(organization.name || '');
      setDescription(organization.description || '');
      setWebsite(organization.website || '');
      setIndustry(organization.industry || '');
      setSize((organization.size as OrganizationSize) || '');
    }
  }, [organization]);

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
    setSuccessMessage(null);

    if (!validateForm()) return;

    updateMutation.mutate({
      name: name.trim(),
      description: description.trim() || undefined,
      website: website.trim() || undefined,
      industry: industry.trim() || undefined,
      size: size || undefined,
    });
  };

  if (!organizationId) {
    return (
      <Container maxW="2xl" py={8}>
        <GlassCard p={8}>
          <VStack spacing={4} textAlign="center">
            <Icon as={FiBriefcase} boxSize={12} color="neutral.400" />
            <Heading size="md">No Organization</Heading>
            <Text color="neutral.500">
              You need to create an organization first.
            </Text>
            <GlassButton as="a" href="/organizations/create">
              Create Organization
            </GlassButton>
          </VStack>
        </GlassCard>
      </Container>
    );
  }

  if (isLoading) {
    return (
      <Center minH="400px">
        <Spinner size="xl" color="primary.500" />
      </Center>
    );
  }

  return (
    <Container maxW="2xl" py={8}>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Box>
          <HStack spacing={3} mb={2}>
            <Heading as="h1" size="lg">
              Organization Settings
            </Heading>
            {organization?.isVerified && (
              <Badge
                colorScheme="green"
                display="flex"
                alignItems="center"
                gap={1}
              >
                <Icon as={FiCheck} boxSize={3} />
                Verified
              </Badge>
            )}
          </HStack>
          <Text color="neutral.600" _dark={{ color: 'neutral.400' }}>
            Manage your organization profile and settings
          </Text>
        </Box>

        <GlassCard p={{ base: 6, md: 8 }}>
          <VStack spacing={6} align="stretch">
            {/* Success Message */}
            {successMessage && (
              <GlassAlert
                status="success"
                title={successMessage}
                isClosable
                onClose={() => setSuccessMessage(null)}
              />
            )}

            {/* Error Message */}
            {updateMutation.error && (
              <GlassAlert
                status="error"
                title="Failed to save"
                description={
                  updateMutation.error instanceof Error
                    ? updateMutation.error.message
                    : 'An error occurred'
                }
                isClosable
              />
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
                    placeholder="Tell candidates about your company..."
                    rows={4}
                    bg="transparent"
                    borderColor="glass.light.border"
                    _dark={{ borderColor: 'glass.dark.border' }}
                    _hover={{ borderColor: 'primary.300' }}
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
                    _hover={{ borderColor: 'primary.300' }}
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

                {/* Organization Slug (read-only) */}
                <FormControl>
                  <FormLabel>Organization URL Slug</FormLabel>
                  <GlassInput
                    value={organization?.slug || ''}
                    isReadOnly
                    bg="neutral.50"
                    _dark={{ bg: 'rgba(255, 255, 255, 0.05)' }}
                  />
                  <Text fontSize="xs" color="neutral.500" mt={1}>
                    This cannot be changed
                  </Text>
                </FormControl>

                {/* Submit Button */}
                <GlassButton
                  type="submit"
                  colorScheme="primary"
                  size="lg"
                  w="full"
                  isLoading={updateMutation.isPending}
                  loadingText="Saving..."
                  leftIcon={<FiSave />}
                  mt={4}
                >
                  Save Changes
                </GlassButton>
              </VStack>
            </form>
          </VStack>
        </GlassCard>
      </VStack>
    </Container>
  );
}
