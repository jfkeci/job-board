'use client';

import { JobStatus } from '@borg/types';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Flex,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Icon,
  Center,
  Spinner,
  useDisclosure,
  GlassCard,
  GlassButton,
} from '@borg/ui';
import {
  Select,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
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
import { useRouter } from 'next/navigation';
import { useState, useRef } from 'react';
import { FiPlus, FiMoreVertical, FiEdit, FiEye, FiTrash2, FiPlay, FiPause, FiBriefcase } from 'react-icons/fi';

import { JobStatusBadge, JobTierBadge } from '@/components/jobs';
import { useJobs, useDeleteJob } from '@/hooks/use-jobs';

type StatusFilter = JobStatus | 'ALL';

const statusOptions: { value: StatusFilter; label: string }[] = [
  { value: 'ALL', label: 'All Statuses' },
  { value: JobStatus.DRAFT, label: 'Draft' },
  { value: JobStatus.ACTIVE, label: 'Active' },
  { value: JobStatus.CLOSED, label: 'Closed' },
  { value: JobStatus.EXPIRED, label: 'Expired' },
];

function formatDate(dateString: string | null): string {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function JobsListPage() {
  const router = useRouter();
  const { data: jobsData, isLoading, error } = useJobs();
  const deleteJob = useDeleteJob();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [jobToDelete, setJobToDelete] = useState<string | null>(null);
  const [jobToClose, setJobToClose] = useState<string | null>(null);

  const deleteDialogRef = useRef<HTMLButtonElement>(null);
  const closeDialogRef = useRef<HTMLButtonElement>(null);
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const { isOpen: isCloseOpen, onOpen: onCloseOpen, onClose: onCloseClose } = useDisclosure();

  // Filter jobs by status
  const filteredJobs = statusFilter === 'ALL'
    ? jobsData?.data
    : jobsData?.data?.filter((job) => job.status === statusFilter);

  const handleDeleteClick = (jobId: string) => {
    setJobToDelete(jobId);
    onDeleteOpen();
  };

  const handleDeleteConfirm = async () => {
    if (jobToDelete) {
      try {
        await deleteJob.mutateAsync(jobToDelete);
        onDeleteClose();
        setJobToDelete(null);
      } catch {
        // Error handled by mutation
      }
    }
  };

  const handleCloseClick = (jobId: string) => {
    setJobToClose(jobId);
    onCloseOpen();
  };

  if (isLoading) {
    return (
      <Center minH="400px">
        <Spinner size="xl" color="primary.500" />
      </Center>
    );
  }

  if (error) {
    return (
      <Container maxW="6xl" py={8}>
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          Failed to load jobs. Please try again later.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxW="6xl" py={8}>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
          <VStack align="start" spacing={1}>
            <Heading size="lg">Your Jobs</Heading>
            <Text color="neutral.600" _dark={{ color: 'neutral.400' }}>
              Manage your job postings
            </Text>
          </VStack>
          <Link href="/jobs/create">
            <GlassButton colorScheme="primary" leftIcon={<Icon as={FiPlus} />}>
              Create Job
            </GlassButton>
          </Link>
        </Flex>

        {/* Filters */}
        <HStack spacing={4}>
          <Select
            value={statusFilter}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStatusFilter(e.target.value as StatusFilter)}
            maxW="200px"
            bg="transparent"
            borderColor="glass.light.border"
            _dark={{ borderColor: 'glass.dark.border' }}
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
          <Text color="neutral.500" fontSize="sm">
            {filteredJobs?.length || 0} job{filteredJobs?.length !== 1 ? 's' : ''}
          </Text>
        </HStack>

        {/* Jobs Table or Empty State */}
        {!filteredJobs || filteredJobs.length === 0 ? (
          <GlassCard p={12}>
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
                <Heading size="md">No jobs yet</Heading>
                <Text color="neutral.600" _dark={{ color: 'neutral.400' }}>
                  Create your first job posting to start attracting candidates
                </Text>
              </VStack>
              <Link href="/jobs/create">
                <GlassButton colorScheme="primary" leftIcon={<Icon as={FiPlus} />}>
                  Create Your First Job
                </GlassButton>
              </Link>
            </VStack>
          </GlassCard>
        ) : (
          <GlassCard overflow="hidden" p={0}>
            <Box overflowX="auto">
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Title</Th>
                    <Th>Status</Th>
                    <Th>Tier</Th>
                    <Th>Created</Th>
                    <Th isNumeric>Views</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredJobs.map((job) => (
                    <Tr key={job.id}>
                      <Td>
                        <Link href={`/jobs/${job.id}`}>
                          <Text
                            fontWeight="medium"
                            _hover={{ color: 'primary.500', textDecoration: 'underline' }}
                          >
                            {job.title}
                          </Text>
                        </Link>
                      </Td>
                      <Td>
                        <JobStatusBadge status={job.status} />
                      </Td>
                      <Td>
                        <JobTierBadge tier={job.tier} />
                      </Td>
                      <Td>
                        <Text fontSize="sm" color="neutral.600" _dark={{ color: 'neutral.400' }}>
                          {formatDate(job.createdAt)}
                        </Text>
                      </Td>
                      <Td isNumeric>
                        <Text fontSize="sm">{job.viewCount}</Text>
                      </Td>
                      <Td>
                        <Menu>
                          <MenuButton
                            as={IconButton}
                            aria-label="Actions"
                            icon={<FiMoreVertical />}
                            variant="ghost"
                            size="sm"
                          />
                          <MenuList>
                            <MenuItem
                              icon={<FiEye />}
                              onClick={() => router.push(`/jobs/${job.id}`)}
                            >
                              View
                            </MenuItem>
                            <MenuItem
                              icon={<FiEdit />}
                              onClick={() => router.push(`/jobs/${job.id}/edit`)}
                            >
                              Edit
                            </MenuItem>
                            {job.status === JobStatus.DRAFT && (
                              <>
                                <MenuItem
                                  icon={<FiPlay />}
                                  onClick={() => router.push(`/jobs/${job.id}?publish=true`)}
                                >
                                  Publish
                                </MenuItem>
                                <MenuItem
                                  icon={<FiTrash2 />}
                                  color="red.500"
                                  onClick={() => handleDeleteClick(job.id)}
                                >
                                  Delete
                                </MenuItem>
                              </>
                            )}
                            {job.status === JobStatus.ACTIVE && (
                              <MenuItem
                                icon={<FiPause />}
                                color="orange.500"
                                onClick={() => handleCloseClick(job.id)}
                              >
                                Close
                              </MenuItem>
                            )}
                          </MenuList>
                        </Menu>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </GlassCard>
        )}
      </VStack>

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
              Are you sure you want to delete this job? This action cannot be undone.
            </AlertDialogBody>
            <AlertDialogFooter>
              <GlassButton ref={deleteDialogRef} onClick={onDeleteClose}>
                Cancel
              </GlassButton>
              <GlassButton
                colorScheme="red"
                onClick={handleDeleteConfirm}
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
              Are you sure you want to close this job? It will no longer be visible to candidates.
            </AlertDialogBody>
            <AlertDialogFooter>
              <GlassButton ref={closeDialogRef} onClick={onCloseClose}>
                Cancel
              </GlassButton>
              <GlassButton
                colorScheme="orange"
                onClick={() => {
                  // Close job action will be handled in detail page
                  onCloseClose();
                  if (jobToClose) {
                    router.push(`/jobs/${jobToClose}?close=true`);
                  }
                }}
                ml={3}
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
