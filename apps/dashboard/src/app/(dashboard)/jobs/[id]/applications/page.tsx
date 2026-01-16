'use client';

import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Flex,
  Badge,
  Icon,
  Center,
  Spinner,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Select,
  Textarea,
  useToast,
  Divider,
  GlassCard,
  GlassButton,
} from '@job-board/ui';
import { Alert, AlertIcon } from '@chakra-ui/react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  FiArrowLeft,
  FiMail,
  FiPhone,
  FiLinkedin,
  FiGlobe,
  FiFileText,
  FiCalendar,
  FiUser,
} from 'react-icons/fi';

import {
  applicationsApi,
  type Application,
  type ApplicationStatus,
} from '@/lib/api';
import { useJob } from '@/hooks/use-jobs';

const statusColors: Record<ApplicationStatus, string> = {
  SUBMITTED: 'blue',
  REVIEWING: 'yellow',
  SHORTLISTED: 'purple',
  INTERVIEW: 'cyan',
  OFFERED: 'green',
  REJECTED: 'red',
  WITHDRAWN: 'gray',
};

const statusLabels: Record<ApplicationStatus, string> = {
  SUBMITTED: 'Submitted',
  REVIEWING: 'Under Review',
  SHORTLISTED: 'Shortlisted',
  INTERVIEW: 'Interview',
  OFFERED: 'Offer Extended',
  REJECTED: 'Not Selected',
  WITHDRAWN: 'Withdrawn',
};

const allStatuses: ApplicationStatus[] = [
  'SUBMITTED',
  'REVIEWING',
  'SHORTLISTED',
  'INTERVIEW',
  'OFFERED',
  'REJECTED',
  'WITHDRAWN',
];

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function ApplicationCard({
  application,
  onViewDetails,
}: {
  application: Application;
  onViewDetails: (app: Application) => void;
}) {
  return (
    <GlassCard
      p={4}
      cursor="pointer"
      onClick={() => onViewDetails(application)}
      _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
      transition="all 0.2s"
    >
      <Flex justify="space-between" align="start">
        <VStack align="start" spacing={2}>
          <HStack>
            <Icon as={FiUser} color="primary.500" />
            <Text fontWeight="semibold">
              {application.firstName} {application.lastName}
            </Text>
          </HStack>
          <HStack spacing={4} color="neutral.500" fontSize="sm">
            <HStack>
              <Icon as={FiMail} size="sm" />
              <Text>{application.email}</Text>
            </HStack>
            {application.phone && (
              <HStack>
                <Icon as={FiPhone} size="sm" />
                <Text>{application.phone}</Text>
              </HStack>
            )}
          </HStack>
          <HStack fontSize="xs" color="neutral.400">
            <Icon as={FiCalendar} />
            <Text>Applied {formatDate(application.submittedAt)}</Text>
          </HStack>
        </VStack>

        <Badge colorScheme={statusColors[application.status]} size="lg">
          {statusLabels[application.status]}
        </Badge>
      </Flex>

      {/* Quick links */}
      <HStack mt={3} spacing={3}>
        {application.linkedinUrl && (
          <Link
            href={application.linkedinUrl}
            target="_blank"
            onClick={(e) => e.stopPropagation()}
          >
            <HStack
              fontSize="sm"
              color="blue.400"
              _hover={{ color: 'blue.300' }}
            >
              <Icon as={FiLinkedin} />
              <Text>LinkedIn</Text>
            </HStack>
          </Link>
        )}
        {application.portfolioUrl && (
          <Link
            href={application.portfolioUrl}
            target="_blank"
            onClick={(e) => e.stopPropagation()}
          >
            <HStack
              fontSize="sm"
              color="green.400"
              _hover={{ color: 'green.300' }}
            >
              <Icon as={FiGlobe} />
              <Text>Portfolio</Text>
            </HStack>
          </Link>
        )}
        {application.resumeUrl && (
          <Link
            href={application.resumeUrl}
            target="_blank"
            onClick={(e) => e.stopPropagation()}
          >
            <HStack
              fontSize="sm"
              color="orange.400"
              _hover={{ color: 'orange.300' }}
            >
              <Icon as={FiFileText} />
              <Text>Resume</Text>
            </HStack>
          </Link>
        )}
      </HStack>
    </GlassCard>
  );
}

function ApplicationDetailModal({
  isOpen,
  onClose,
  application,
  onStatusUpdate,
}: {
  isOpen: boolean;
  onClose: () => void;
  application: Application | null;
  onStatusUpdate: (
    id: string,
    status: ApplicationStatus,
    notes?: string,
  ) => void;
}) {
  const [newStatus, setNewStatus] = useState<ApplicationStatus | ''>('');
  const [notes, setNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  if (!application) return null;

  const handleUpdateStatus = async () => {
    if (!newStatus) return;
    setIsUpdating(true);
    try {
      await onStatusUpdate(application.id, newStatus, notes || undefined);
      setNewStatus('');
      setNotes('');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <VStack align="start" spacing={1}>
            <Text>
              {application.firstName} {application.lastName}
            </Text>
            <Badge colorScheme={statusColors[application.status]}>
              {statusLabels[application.status]}
            </Badge>
          </VStack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack align="stretch" spacing={6}>
            {/* Contact Info */}
            <Box>
              <Text fontWeight="semibold" mb={3}>
                Contact Information
              </Text>
              <VStack align="start" spacing={2}>
                <HStack>
                  <Icon as={FiMail} color="primary.500" />
                  <Link href={`mailto:${application.email}`}>
                    <Text
                      color="blue.400"
                      _hover={{ textDecoration: 'underline' }}
                    >
                      {application.email}
                    </Text>
                  </Link>
                </HStack>
                {application.phone && (
                  <HStack>
                    <Icon as={FiPhone} color="primary.500" />
                    <Text>{application.phone}</Text>
                  </HStack>
                )}
                {application.linkedinUrl && (
                  <HStack>
                    <Icon as={FiLinkedin} color="primary.500" />
                    <Link href={application.linkedinUrl} target="_blank">
                      <Text
                        color="blue.400"
                        _hover={{ textDecoration: 'underline' }}
                      >
                        LinkedIn Profile
                      </Text>
                    </Link>
                  </HStack>
                )}
                {application.portfolioUrl && (
                  <HStack>
                    <Icon as={FiGlobe} color="primary.500" />
                    <Link href={application.portfolioUrl} target="_blank">
                      <Text
                        color="blue.400"
                        _hover={{ textDecoration: 'underline' }}
                      >
                        Portfolio
                      </Text>
                    </Link>
                  </HStack>
                )}
              </VStack>
            </Box>

            <Divider />

            {/* Cover Letter */}
            {application.coverLetter && (
              <Box>
                <Text fontWeight="semibold" mb={3}>
                  Cover Letter
                </Text>
                <Box
                  p={4}
                  bg="gray.50"
                  _dark={{ bg: 'gray.700' }}
                  borderRadius="md"
                  maxH="200px"
                  overflowY="auto"
                >
                  <Text whiteSpace="pre-wrap" fontSize="sm">
                    {application.coverLetter}
                  </Text>
                </Box>
              </Box>
            )}

            {application.resumeUrl && (
              <Box>
                <Text fontWeight="semibold" mb={3}>
                  Resume
                </Text>
                <Link href={application.resumeUrl} target="_blank">
                  <GlassButton leftIcon={<Icon as={FiFileText} />} size="sm">
                    View Resume
                  </GlassButton>
                </Link>
              </Box>
            )}

            <Divider />

            {/* Update Status */}
            <Box>
              <Text fontWeight="semibold" mb={3}>
                Update Status
              </Text>
              <VStack align="stretch" spacing={3}>
                <FormControl>
                  <FormLabel fontSize="sm">New Status</FormLabel>
                  <Select
                    value={newStatus}
                    onChange={(e) =>
                      setNewStatus(e.target.value as ApplicationStatus)
                    }
                    placeholder="Select new status"
                  >
                    {allStatuses
                      .filter((s) => s !== application.status)
                      .map((status) => (
                        <option key={status} value={status}>
                          {statusLabels[status]}
                        </option>
                      ))}
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel fontSize="sm">Notes (optional)</FormLabel>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add internal notes about this status change..."
                    rows={3}
                  />
                </FormControl>

                <GlassButton
                  onClick={handleUpdateStatus}
                  isDisabled={!newStatus}
                  isLoading={isUpdating}
                  colorScheme="primary"
                >
                  Update Status
                </GlassButton>
              </VStack>
            </Box>

            {/* Internal Notes */}
            {application.notes && (
              <Box>
                <Text fontWeight="semibold" mb={3}>
                  Internal Notes
                </Text>
                <Box
                  p={4}
                  bg="yellow.50"
                  _dark={{ bg: 'yellow.900' }}
                  borderRadius="md"
                  borderLeft="4px"
                  borderColor="yellow.400"
                >
                  <Text whiteSpace="pre-wrap" fontSize="sm">
                    {application.notes}
                  </Text>
                </Box>
              </Box>
            )}

            {/* Timestamps */}
            <HStack fontSize="xs" color="neutral.500" justify="space-between">
              <Text>Applied: {formatDate(application.submittedAt)}</Text>
              {application.reviewedAt && (
                <Text>Last reviewed: {formatDate(application.reviewedAt)}</Text>
              )}
            </HStack>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <GlassButton variant="ghost" onClick={onClose}>
            Close
          </GlassButton>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default function JobApplicationsPage() {
  const params = useParams();
  const toast = useToast();
  const queryClient = useQueryClient();
  const jobId = params.id as string;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | ''>('');

  const { data: job, isLoading: jobLoading } = useJob(jobId);

  const { data: applicationsData, isLoading: applicationsLoading } = useQuery({
    queryKey: ['job-applications', jobId],
    queryFn: () => applicationsApi.getByJob(jobId),
    enabled: !!jobId,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({
      id,
      status,
      notes,
    }: {
      id: string;
      status: ApplicationStatus;
      notes?: string;
    }) => applicationsApi.updateStatus(id, status, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job-applications', jobId] });
      toast({ title: 'Status updated', status: 'success', duration: 3000 });
      onClose();
    },
    onError: () => {
      toast({
        title: 'Failed to update status',
        status: 'error',
        duration: 3000,
      });
    },
  });

  const handleViewDetails = (application: Application) => {
    setSelectedApplication(application);
    onOpen();
  };

  const handleStatusUpdate = (
    id: string,
    status: ApplicationStatus,
    notes?: string,
  ) => {
    updateStatusMutation.mutate({ id, status, notes });
  };

  const isLoading = jobLoading || applicationsLoading;
  const applications = applicationsData?.data || [];
  const filteredApplications = statusFilter
    ? applications.filter((app) => app.status === statusFilter)
    : applications;

  // Group by status for summary
  const statusCounts = applications.reduce(
    (acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    },
    {} as Record<ApplicationStatus, number>,
  );

  if (isLoading) {
    return (
      <Center minH="400px">
        <Spinner size="xl" color="primary.500" />
      </Center>
    );
  }

  if (!job) {
    return (
      <Container maxW="4xl" py={8}>
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          Job not found.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxW="4xl" py={8}>
      <VStack spacing={6} align="stretch">
        {/* Back Link */}
        <Link href={`/jobs/${jobId}`}>
          <HStack
            spacing={2}
            color="primary.500"
            _hover={{ color: 'primary.600' }}
          >
            <Icon as={FiArrowLeft} />
            <Text>Back to Job</Text>
          </HStack>
        </Link>

        {/* Header */}
        <Flex justify="space-between" align="start" wrap="wrap" gap={4}>
          <VStack align="start" spacing={1}>
            <Heading size="lg">Applications</Heading>
            <Text color="neutral.500">{job.title}</Text>
          </VStack>

          <HStack>
            <Select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as ApplicationStatus)
              }
              placeholder="All statuses"
              maxW="200px"
            >
              {allStatuses.map((status) => (
                <option key={status} value={status}>
                  {statusLabels[status]} ({statusCounts[status] || 0})
                </option>
              ))}
            </Select>
          </HStack>
        </Flex>

        {/* Stats Summary */}
        <HStack spacing={4} flexWrap="wrap">
          <GlassCard p={3}>
            <VStack spacing={0}>
              <Text fontSize="2xl" fontWeight="bold">
                {applications.length}
              </Text>
              <Text fontSize="xs" color="neutral.500">
                Total
              </Text>
            </VStack>
          </GlassCard>
          <GlassCard p={3}>
            <VStack spacing={0}>
              <Text fontSize="2xl" fontWeight="bold" color="blue.400">
                {statusCounts.SUBMITTED || 0}
              </Text>
              <Text fontSize="xs" color="neutral.500">
                New
              </Text>
            </VStack>
          </GlassCard>
          <GlassCard p={3}>
            <VStack spacing={0}>
              <Text fontSize="2xl" fontWeight="bold" color="yellow.400">
                {statusCounts.REVIEWING || 0}
              </Text>
              <Text fontSize="xs" color="neutral.500">
                Reviewing
              </Text>
            </VStack>
          </GlassCard>
          <GlassCard p={3}>
            <VStack spacing={0}>
              <Text fontSize="2xl" fontWeight="bold" color="purple.400">
                {statusCounts.SHORTLISTED || 0}
              </Text>
              <Text fontSize="xs" color="neutral.500">
                Shortlisted
              </Text>
            </VStack>
          </GlassCard>
          <GlassCard p={3}>
            <VStack spacing={0}>
              <Text fontSize="2xl" fontWeight="bold" color="cyan.400">
                {statusCounts.INTERVIEW || 0}
              </Text>
              <Text fontSize="xs" color="neutral.500">
                Interview
              </Text>
            </VStack>
          </GlassCard>
        </HStack>

        {/* Applications List */}
        {filteredApplications.length === 0 ? (
          <GlassCard p={8}>
            <Center>
              <VStack spacing={3}>
                <Icon as={FiUser} boxSize={12} color="neutral.400" />
                <Text color="neutral.500">
                  {statusFilter
                    ? `No applications with status "${statusLabels[statusFilter]}"`
                    : 'No applications yet'}
                </Text>
              </VStack>
            </Center>
          </GlassCard>
        ) : (
          <VStack align="stretch" spacing={3}>
            {filteredApplications.map((application) => (
              <ApplicationCard
                key={application.id}
                application={application}
                onViewDetails={handleViewDetails}
              />
            ))}
          </VStack>
        )}
      </VStack>

      {/* Application Detail Modal */}
      <ApplicationDetailModal
        isOpen={isOpen}
        onClose={onClose}
        application={selectedApplication}
        onStatusUpdate={handleStatusUpdate}
      />
    </Container>
  );
}
