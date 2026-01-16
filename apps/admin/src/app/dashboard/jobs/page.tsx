"use client";

import {
  Box,
  Flex,
  VStack,
  HStack,
  Text,
  Input,
  InputGroup,
  InputLeftElement,
  Badge,
  Spinner,
  GlassCard,
  GlassButton,
} from "@job-board/ui";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FiSearch, FiBriefcase, FiEye, FiUsers } from "react-icons/fi";

import { apiClient, type PaginatedResponse } from "@/lib/api";

interface Job {
  id: string;
  title: string;
  slug: string;
  status: string;
  organization: {
    id: string;
    name: string;
  };
  category: {
    id: string;
    name: string;
  } | null;
  location: {
    id: string;
    name: string;
  } | null;
  tier: string;
  viewCount: number;
  applicationCount: number;
  publishedAt: string | null;
  expiresAt: string | null;
}

const statusColors: Record<string, string> = {
  DRAFT: "gray",
  PENDING_REVIEW: "yellow",
  PUBLISHED: "green",
  PAUSED: "orange",
  EXPIRED: "red",
  ARCHIVED: "gray",
};

const tierColors: Record<string, string> = {
  FREE: "gray",
  BASIC: "blue",
  STANDARD: "purple",
  PREMIUM: "orange",
};

export default function JobsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // Note: This uses a generic jobs endpoint - in production, you'd have an admin-specific one
  const { data, isLoading } = useQuery({
    queryKey: ["admin-jobs", page, search],
    queryFn: () => {
      const query = new URLSearchParams();
      query.set("page", page.toString());
      query.set("limit", "20");
      if (search) query.set("search", search);
      return apiClient<PaginatedResponse<Job>>(
        `/admin/jobs?${query.toString()}`,
      );
    },
  });

  const jobs = data?.data || [];
  const totalPages = data?.totalPages || 1;

  return (
    <VStack align="stretch" spacing={6}>
      <Flex justify="space-between" align="center">
        <Box>
          <Text fontSize="2xl" fontWeight="bold" color="white">
            Jobs
          </Text>
          <Text color="whiteAlpha.600" fontSize="sm">
            Overview of all job listings across the platform
          </Text>
        </Box>
      </Flex>

      <GlassCard>
        <VStack align="stretch" spacing={4} p={4}>
          {/* Filters */}
          <HStack spacing={4}>
            <InputGroup maxW="300px">
              <InputLeftElement pointerEvents="none">
                <FiSearch color="gray" />
              </InputLeftElement>
              <Input
                placeholder="Search jobs..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                bg="whiteAlpha.100"
                border="none"
                color="white"
                _placeholder={{ color: "whiteAlpha.400" }}
              />
            </InputGroup>
          </HStack>

          {/* Table */}
          {isLoading ? (
            <Flex justify="center" py={8}>
              <Spinner color="white" />
            </Flex>
          ) : jobs.length === 0 ? (
            <Box textAlign="center" py={8}>
              <Text color="whiteAlpha.600">No jobs found</Text>
            </Box>
          ) : (
            <Box overflowX="auto">
              <Box as="table" w="full" fontSize="sm">
                <Box as="thead">
                  <Box as="tr" borderBottom="1px" borderColor="whiteAlpha.100">
                    <Box
                      as="th"
                      py={3}
                      px={4}
                      textAlign="left"
                      color="whiteAlpha.600"
                      fontWeight="medium"
                    >
                      Title
                    </Box>
                    <Box
                      as="th"
                      py={3}
                      px={4}
                      textAlign="left"
                      color="whiteAlpha.600"
                      fontWeight="medium"
                    >
                      Organization
                    </Box>
                    <Box
                      as="th"
                      py={3}
                      px={4}
                      textAlign="left"
                      color="whiteAlpha.600"
                      fontWeight="medium"
                    >
                      Status
                    </Box>
                    <Box
                      as="th"
                      py={3}
                      px={4}
                      textAlign="left"
                      color="whiteAlpha.600"
                      fontWeight="medium"
                    >
                      Tier
                    </Box>
                    <Box
                      as="th"
                      py={3}
                      px={4}
                      textAlign="center"
                      color="whiteAlpha.600"
                      fontWeight="medium"
                    >
                      <HStack justify="center" spacing={1}>
                        <FiEye />
                        <Text>Views</Text>
                      </HStack>
                    </Box>
                    <Box
                      as="th"
                      py={3}
                      px={4}
                      textAlign="center"
                      color="whiteAlpha.600"
                      fontWeight="medium"
                    >
                      <HStack justify="center" spacing={1}>
                        <FiUsers />
                        <Text>Apps</Text>
                      </HStack>
                    </Box>
                    <Box
                      as="th"
                      py={3}
                      px={4}
                      textAlign="left"
                      color="whiteAlpha.600"
                      fontWeight="medium"
                    >
                      Published
                    </Box>
                  </Box>
                </Box>
                <Box as="tbody">
                  {jobs.map((job) => (
                    <Box
                      as="tr"
                      key={job.id}
                      borderBottom="1px"
                      borderColor="whiteAlpha.50"
                      _hover={{ bg: "whiteAlpha.50" }}
                    >
                      <Box as="td" py={3} px={4}>
                        <VStack align="start" spacing={0}>
                          <Text color="white" fontWeight="medium">
                            {job.title}
                          </Text>
                          <Text fontSize="xs" color="whiteAlpha.500">
                            {job.location?.name || "No location"} •{" "}
                            {job.category?.name || "No category"}
                          </Text>
                        </VStack>
                      </Box>
                      <Box as="td" py={3} px={4} color="whiteAlpha.800">
                        {job.organization.name}
                      </Box>
                      <Box as="td" py={3} px={4}>
                        <Badge colorScheme={statusColors[job.status] || "gray"}>
                          {job.status.replace("_", " ")}
                        </Badge>
                      </Box>
                      <Box as="td" py={3} px={4}>
                        <Badge colorScheme={tierColors[job.tier] || "gray"}>
                          {job.tier}
                        </Badge>
                      </Box>
                      <Box
                        as="td"
                        py={3}
                        px={4}
                        textAlign="center"
                        color="whiteAlpha.800"
                      >
                        {job.viewCount?.toLocaleString() || 0}
                      </Box>
                      <Box
                        as="td"
                        py={3}
                        px={4}
                        textAlign="center"
                        color="whiteAlpha.800"
                      >
                        {job.applicationCount?.toLocaleString() || 0}
                      </Box>
                      <Box as="td" py={3} px={4} color="whiteAlpha.600">
                        {job.publishedAt
                          ? new Date(job.publishedAt).toLocaleDateString()
                          : "-"}
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <HStack justify="center" spacing={2} pt={4}>
              <GlassButton
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                isDisabled={page === 1}
              >
                Previous
              </GlassButton>
              <Text color="whiteAlpha.600" fontSize="sm">
                Page {page} of {totalPages}
              </Text>
              <GlassButton
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                isDisabled={page === totalPages}
              >
                Next
              </GlassButton>
            </HStack>
          )}
        </VStack>
      </GlassCard>
    </VStack>
  );
}
