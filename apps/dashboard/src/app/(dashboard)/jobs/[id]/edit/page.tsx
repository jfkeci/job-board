'use client';

import type { CreateJobDto, UpdateJobDto } from '@job-board/types';
import {
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Icon,
  Center,
  Spinner,
  GlassCard,
} from '@job-board/ui';
import { Alert, AlertIcon } from '@chakra-ui/react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { FiArrowLeft } from 'react-icons/fi';

import { JobForm } from '@/components/jobs';
import { useJob, useUpdateJob } from '@/hooks/use-jobs';

export default function EditJobPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: job, isLoading: isLoadingJob, error: jobError } = useJob(id);
  const updateJob = useUpdateJob(id);

  const handleSubmit = async (data: CreateJobDto | UpdateJobDto) => {
    await updateJob.mutateAsync(data as UpdateJobDto);
    router.push(`/jobs/${id}`);
  };

  const handleCancel = () => {
    router.push(`/jobs/${id}`);
  };

  if (isLoadingJob) {
    return (
      <Center minH="400px">
        <Spinner size="xl" color="primary.500" />
      </Center>
    );
  }

  if (jobError || !job) {
    return (
      <Container maxW="4xl" py={8}>
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          Failed to load job. Please try again later.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxW="4xl" py={8}>
      <VStack spacing={6} align="stretch">
        {/* Back Link */}
        <Link href={`/jobs/${id}`}>
          <HStack
            spacing={2}
            color="primary.500"
            _hover={{ color: 'primary.600' }}
          >
            <Icon as={FiArrowLeft} />
            <Text>Back to Job Details</Text>
          </HStack>
        </Link>

        {/* Header */}
        <VStack spacing={2} align="start">
          <Heading size="lg">Edit Job</Heading>
          <Text color="neutral.600" _dark={{ color: 'neutral.400' }}>
            Update the details for &quot;{job.title}&quot;
          </Text>
        </VStack>

        {/* Error Alert */}
        {updateJob.error && (
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            {updateJob.error instanceof Error
              ? updateJob.error.message
              : 'Failed to update job'}
          </Alert>
        )}

        {/* Form */}
        <GlassCard p={{ base: 6, md: 8 }}>
          <JobForm
            initialData={job}
            onSubmit={handleSubmit}
            isLoading={updateJob.isPending}
            submitLabel="Save Changes"
            onCancel={handleCancel}
          />
        </GlassCard>
      </VStack>
    </Container>
  );
}
