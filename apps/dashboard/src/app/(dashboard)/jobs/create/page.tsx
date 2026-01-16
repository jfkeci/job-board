'use client';

import type { CreateJobDto, UpdateJobDto } from '@job-board/types';
import { Container, Heading, Text, VStack, GlassCard } from '@job-board/ui';
import { Alert, AlertIcon } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';

import { JobForm } from '@/components/jobs';
import { useCreateJob } from '@/hooks/use-jobs';

export default function CreateJobPage() {
  const router = useRouter();
  const createJob = useCreateJob();

  const handleSubmit = async (data: CreateJobDto | UpdateJobDto) => {
    const result = await createJob.mutateAsync(data as CreateJobDto);
    router.push(`/jobs/${result.id}`);
  };

  const handleCancel = () => {
    router.push('/jobs');
  };

  return (
    <Container maxW="4xl" py={8}>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <VStack spacing={2} align="start">
          <Heading size="lg">Create Job Advertisement</Heading>
          <Text color="neutral.600" _dark={{ color: 'neutral.400' }}>
            Fill in the details below to create a new job listing as a draft.
          </Text>
        </VStack>

        {/* Error Alert */}
        {createJob.error && (
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            {createJob.error instanceof Error
              ? createJob.error.message
              : 'Failed to create job'}
          </Alert>
        )}

        {/* Form */}
        <GlassCard p={{ base: 6, md: 8 }}>
          <JobForm
            onSubmit={handleSubmit}
            isLoading={createJob.isPending}
            submitLabel="Create Job Draft"
            onCancel={handleCancel}
          />
        </GlassCard>
      </VStack>
    </Container>
  );
}
