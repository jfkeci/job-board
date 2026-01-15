'use client';

import { JobStatus, EmploymentType, RemoteOption, ExperienceLevel, SalaryPeriod } from '@borg/types';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Flex,
  SimpleGrid,
  Divider,
  Icon,
  Center,
  Spinner,
  useDisclosure,
  GlassCard,
  GlassButton,
} from '@borg/ui';
import {
  Alert,
  AlertIcon,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from '@chakra-ui/react';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';
import {
  FiEdit,
  FiTrash2,
  FiPlay,
  FiPause,
  FiClock,
  FiArrowLeft,
  FiEye,
  FiCalendar,
  FiMapPin,
  FiBriefcase,
  FiDollarSign,
} from 'react-icons/fi';

import { JobStatusBadge, JobTierBadge, PublishJobModal } from '@/components/jobs';
import { useJob, useDeleteJob, useCloseJob, useExtendJob } from '@/hooks/use-jobs';

const employmentTypeLabels: Record<EmploymentType, string> = {
  [EmploymentType.FULL_TIME]: 'Full Time',
  [EmploymentType.PART_TIME]: 'Part Time',
  [EmploymentType.CONTRACT]: 'Contract',
  [EmploymentType.FREELANCE]: 'Freelance',
  [EmploymentType.INTERNSHIP]: 'Internship',
};

const remoteOptionLabels: Record<RemoteOption, string> = {
  [RemoteOption.ON_SITE]: 'On-site',
  [RemoteOption.REMOTE]: 'Remote',
  [RemoteOption.HYBRID]: 'Hybrid',
};

const experienceLevelLabels: Record<ExperienceLevel, string> = {
  [ExperienceLevel.ENTRY]: 'Entry Level',
  [ExperienceLevel.JUNIOR]: 'Junior',
  [ExperienceLevel.MID]: 'Mid Level',
  [ExperienceLevel.SENIOR]: 'Senior',
  [ExperienceLevel.LEAD]: 'Lead',
  [ExperienceLevel.EXECUTIVE]: 'Executive',
};

const salaryPeriodLabels: Record<SalaryPeriod, string> = {
  [SalaryPeriod.HOURLY]: '/hour',
  [SalaryPeriod.MONTHLY]: '/month',
  [SalaryPeriod.YEARLY]: '/year',
};

function formatDate(dateString: string | null): string {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatSalary(min: number | null, max: number | null, currency: string, period: SalaryPeriod): string {
  if (!min && !max) return 'Not specified';
  const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 });
  if (min && max) {
    return `${formatter.format(min)} - ${formatter.format(max)}${salaryPeriodLabels[period]}`;
  }
  if (min) {
    return `From ${formatter.format(min)}${salaryPeriodLabels[period]}`;
  }
  return `Up to ${formatter.format(max!)}${salaryPeriodLabels[period]}`;
}

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = params.id as string;

  const { data: job, isLoading, error } = useJob(id);
  const deleteJob = useDeleteJob();
  const closeJob = useCloseJob(id);
  const extendJob = useExtendJob(id);

  const deleteDialogRef = useRef<HTMLButtonElement>(null);
  const closeDialogRef = useRef<HTMLButtonElement>(null);
  const {
    isOpen: isPublishOpen,
    onOpen: onPublishOpen,
    onClose: onPublishClose,
  } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const {
    isOpen: isCloseOpen,
    onOpen: onCloseOpen,
    onClose: onCloseClose,
  } = useDisclosure();

  // Handle URL params for actions
  useEffect(() => {
    if (searchParams.get('publish') === 'true') {
      onPublishOpen();
    }
    if (searchParams.get('close') === 'true') {
      onCloseOpen();
    }
  }, [searchParams, onPublishOpen, onCloseOpen]);

  const handleDelete = async () => {
    try {
      await deleteJob.mutateAsync(id);
      router.push('/jobs');
    } catch {
      // Error handled by mutation
    }
  };

  const handleClose = async () => {
    try {
      await closeJob.mutateAsync();
      onCloseClose();
    } catch {
      // Error handled by mutation
    }
  };

  const handleExtend = async () => {
    try {
      await extendJob.mutateAsync();
    } catch {
      // Error handled by mutation
    }
  };

  if (isLoading) {
    return (
      <Center minH="400px">
        <Spinner size="xl" color="primary.500" />
      </Center>
    );
  }

  if (error || !job) {
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
        <Link href="/jobs">
          <HStack spacing={2} color="primary.500" _hover={{ color: 'primary.600' }}>
            <Icon as={FiArrowLeft} />
            <Text>Back to Jobs</Text>
          </HStack>
        </Link>

        {/* Header */}
        <Flex justify="space-between" align="start" wrap="wrap" gap={4}>
          <VStack align="start" spacing={3}>
            <Heading size="lg">{job.title}</Heading>
            <HStack spacing={3}>
              <JobStatusBadge status={job.status} />
              <JobTierBadge tier={job.tier} />
            </HStack>
          </VStack>

          {/* Action Buttons */}
          <HStack spacing={2}>
            <Link href={`/jobs/${id}/edit`}>
              <GlassButton leftIcon={<Icon as={FiEdit} />} size="sm">
                Edit
              </GlassButton>
            </Link>

            {job.status === JobStatus.DRAFT && (
              <>
                <GlassButton
                  leftIcon={<Icon as={FiPlay} />}
                  colorScheme="green"
                  size="sm"
                  onClick={onPublishOpen}
                >
                  Publish
                </GlassButton>
                <GlassButton
                  leftIcon={<Icon as={FiTrash2} />}
                  colorScheme="red"
                  variant="outline"
                  size="sm"
                  onClick={onDeleteOpen}
                >
                  Delete
                </GlassButton>
              </>
            )}

            {job.status === JobStatus.ACTIVE && (
              <>
                <GlassButton
                  leftIcon={<Icon as={FiClock} />}
                  colorScheme="blue"
                  variant="outline"
                  size="sm"
                  onClick={handleExtend}
                  isLoading={extendJob.isPending}
                >
                  Extend
                </GlassButton>
                <GlassButton
                  leftIcon={<Icon as={FiPause} />}
                  colorScheme="orange"
                  size="sm"
                  onClick={onCloseOpen}
                >
                  Close
                </GlassButton>
              </>
            )}
          </HStack>
        </Flex>

        {/* Stats */}
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
          <GlassCard p={4}>
            <VStack spacing={1} align="start">
              <HStack spacing={2} color="neutral.500">
                <Icon as={FiEye} />
                <Text fontSize="sm">Views</Text>
              </HStack>
              <Text fontSize="2xl" fontWeight="bold">
                {job.viewCount}
              </Text>
            </VStack>
          </GlassCard>

          <GlassCard p={4}>
            <VStack spacing={1} align="start">
              <HStack spacing={2} color="neutral.500">
                <Icon as={FiCalendar} />
                <Text fontSize="sm">Created</Text>
              </HStack>
              <Text fontSize="sm" fontWeight="medium">
                {formatDate(job.createdAt)}
              </Text>
            </VStack>
          </GlassCard>

          <GlassCard p={4}>
            <VStack spacing={1} align="start">
              <HStack spacing={2} color="neutral.500">
                <Icon as={FiPlay} />
                <Text fontSize="sm">Published</Text>
              </HStack>
              <Text fontSize="sm" fontWeight="medium">
                {formatDate(job.publishedAt)}
              </Text>
            </VStack>
          </GlassCard>

          <GlassCard p={4}>
            <VStack spacing={1} align="start">
              <HStack spacing={2} color="neutral.500">
                <Icon as={FiClock} />
                <Text fontSize="sm">Expires</Text>
              </HStack>
              <Text fontSize="sm" fontWeight="medium">
                {formatDate(job.expiresAt)}
              </Text>
            </VStack>
          </GlassCard>
        </SimpleGrid>

        {/* Job Details */}
        <GlassCard p={6}>
          <VStack spacing={6} align="stretch">
            {/* Meta Info */}
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
              <HStack spacing={3}>
                <Icon as={FiBriefcase} color="primary.500" />
                <Box>
                  <Text fontSize="xs" color="neutral.500">
                    Employment
                  </Text>
                  <Text fontWeight="medium">
                    {employmentTypeLabels[job.employmentType]}
                  </Text>
                </Box>
              </HStack>

              <HStack spacing={3}>
                <Icon as={FiMapPin} color="primary.500" />
                <Box>
                  <Text fontSize="xs" color="neutral.500">
                    Location
                  </Text>
                  <Text fontWeight="medium">
                    {remoteOptionLabels[job.remoteOption]}
                  </Text>
                </Box>
              </HStack>

              <HStack spacing={3}>
                <Icon as={FiDollarSign} color="primary.500" />
                <Box>
                  <Text fontSize="xs" color="neutral.500">
                    Salary
                  </Text>
                  <Text fontWeight="medium">
                    {formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency, job.salaryPeriod)}
                  </Text>
                </Box>
              </HStack>
            </SimpleGrid>

            {job.experienceLevel && (
              <Box>
                <Text fontSize="xs" color="neutral.500" mb={1}>
                  Experience Level
                </Text>
                <Text fontWeight="medium">
                  {experienceLevelLabels[job.experienceLevel]}
                </Text>
              </Box>
            )}

            <Divider />

            {/* Description */}
            <Box>
              <Text fontWeight="semibold" mb={3}>
                Job Description
              </Text>
              <Text whiteSpace="pre-wrap" color="neutral.700" _dark={{ color: 'neutral.300' }}>
                {job.description}
              </Text>
            </Box>

            {/* Requirements */}
            {job.requirements && (
              <>
                <Divider />
                <Box>
                  <Text fontWeight="semibold" mb={3}>
                    Requirements
                  </Text>
                  <Text whiteSpace="pre-wrap" color="neutral.700" _dark={{ color: 'neutral.300' }}>
                    {job.requirements}
                  </Text>
                </Box>
              </>
            )}

            {/* Benefits */}
            {job.benefits && (
              <>
                <Divider />
                <Box>
                  <Text fontWeight="semibold" mb={3}>
                    Benefits
                  </Text>
                  <Text whiteSpace="pre-wrap" color="neutral.700" _dark={{ color: 'neutral.300' }}>
                    {job.benefits}
                  </Text>
                </Box>
              </>
            )}
          </VStack>
        </GlassCard>
      </VStack>

      {/* Publish Modal */}
      <PublishJobModal
        isOpen={isPublishOpen}
        onClose={onPublishClose}
        jobId={id}
        onSuccess={() => {
          onPublishClose();
          // Clear URL params
          router.replace(`/jobs/${id}`);
        }}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={deleteDialogRef}
        onClose={onDeleteClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Job
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to delete &quot;{job.title}&quot;? This action cannot be undone.
            </AlertDialogBody>
            <AlertDialogFooter>
              <GlassButton ref={deleteDialogRef} onClick={onDeleteClose}>
                Cancel
              </GlassButton>
              <GlassButton
                colorScheme="red"
                onClick={handleDelete}
                ml={3}
                isLoading={deleteJob.isPending}
              >
                Delete
              </GlassButton>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      {/* Close Confirmation Dialog */}
      <AlertDialog
        isOpen={isCloseOpen}
        leastDestructiveRef={closeDialogRef}
        onClose={onCloseClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Close Job
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to close &quot;{job.title}&quot;? It will no longer be visible to candidates.
            </AlertDialogBody>
            <AlertDialogFooter>
              <GlassButton ref={closeDialogRef} onClick={onCloseClose}>
                Cancel
              </GlassButton>
              <GlassButton
                colorScheme="orange"
                onClick={handleClose}
                ml={3}
                isLoading={closeJob.isPending}
              >
                Close Job
              </GlassButton>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Container>
  );
}
