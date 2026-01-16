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
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useToast,
  Spinner,
  GlassCard,
  GlassButton,
} from "@job-board/ui";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  FiSearch,
  FiMoreVertical,
  FiCheck,
  FiX,
  FiTrash2,
  FiExternalLink,
} from "react-icons/fi";

import { adminApi, type Organization } from "@/lib/api";

export default function OrganizationsPage() {
  const toast = useToast();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-organizations", page, search],
    queryFn: () =>
      adminApi.getOrganizations({
        page,
        limit: 20,
        search: search || undefined,
      }),
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Pick<Organization, "isActive">>;
    }) => adminApi.updateOrganization(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-organizations"] });
      toast({
        title: "Organization updated",
        status: "success",
        duration: 3000,
      });
    },
    onError: () => {
      toast({
        title: "Failed to update organization",
        status: "error",
        duration: 3000,
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: adminApi.deleteOrganization,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-organizations"] });
      toast({
        title: "Organization deleted",
        status: "success",
        duration: 3000,
      });
    },
    onError: () => {
      toast({
        title: "Failed to delete organization",
        status: "error",
        duration: 3000,
      });
    },
  });

  const organizations = data?.data || [];
  const totalPages = data?.totalPages || 1;

  return (
    <VStack align="stretch" spacing={6}>
      <Flex justify="space-between" align="center">
        <Box>
          <Text fontSize="2xl" fontWeight="bold" color="white">
            Organizations
          </Text>
          <Text color="whiteAlpha.600" fontSize="sm">
            Manage companies and their job listings
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
                placeholder="Search organizations..."
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
          ) : organizations.length === 0 ? (
            <Box textAlign="center" py={8}>
              <Text color="whiteAlpha.600">No organizations found</Text>
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
                      Name
                    </Box>
                    <Box
                      as="th"
                      py={3}
                      px={4}
                      textAlign="left"
                      color="whiteAlpha.600"
                      fontWeight="medium"
                    >
                      Slug
                    </Box>
                    <Box
                      as="th"
                      py={3}
                      px={4}
                      textAlign="left"
                      color="whiteAlpha.600"
                      fontWeight="medium"
                    >
                      Industry
                    </Box>
                    <Box
                      as="th"
                      py={3}
                      px={4}
                      textAlign="center"
                      color="whiteAlpha.600"
                      fontWeight="medium"
                    >
                      Jobs
                    </Box>
                    <Box
                      as="th"
                      py={3}
                      px={4}
                      textAlign="center"
                      color="whiteAlpha.600"
                      fontWeight="medium"
                    >
                      Members
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
                      Created
                    </Box>
                    <Box
                      as="th"
                      py={3}
                      px={4}
                      textAlign="right"
                      color="whiteAlpha.600"
                      fontWeight="medium"
                    >
                      Actions
                    </Box>
                  </Box>
                </Box>
                <Box as="tbody">
                  {organizations.map((org) => (
                    <Box
                      as="tr"
                      key={org.id}
                      borderBottom="1px"
                      borderColor="whiteAlpha.50"
                      _hover={{ bg: "whiteAlpha.50" }}
                    >
                      <Box
                        as="td"
                        py={3}
                        px={4}
                        color="white"
                        fontWeight="medium"
                      >
                        {org.name}
                      </Box>
                      <Box as="td" py={3} px={4} color="whiteAlpha.600">
                        {org.slug}
                      </Box>
                      <Box as="td" py={3} px={4} color="whiteAlpha.800">
                        {org.industry || "-"}
                      </Box>
                      <Box
                        as="td"
                        py={3}
                        px={4}
                        textAlign="center"
                        color="whiteAlpha.800"
                      >
                        {org._count?.jobs || 0}
                      </Box>
                      <Box
                        as="td"
                        py={3}
                        px={4}
                        textAlign="center"
                        color="whiteAlpha.800"
                      >
                        {org._count?.members || 0}
                      </Box>
                      <Box as="td" py={3} px={4}>
                        <Badge colorScheme={org.isActive ? "green" : "red"}>
                          {org.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </Box>
                      <Box as="td" py={3} px={4} color="whiteAlpha.600">
                        {new Date(org.createdAt).toLocaleDateString()}
                      </Box>
                      <Box as="td" py={3} px={4} textAlign="right">
                        <Menu>
                          <MenuButton
                            as={IconButton}
                            icon={<FiMoreVertical />}
                            variant="ghost"
                            size="sm"
                            color="whiteAlpha.600"
                            _hover={{ color: "white", bg: "whiteAlpha.100" }}
                          />
                          <MenuList bg="gray.800" borderColor="whiteAlpha.200">
                            <MenuItem
                              icon={<FiExternalLink />}
                              _hover={{ bg: "whiteAlpha.100" }}
                              color="white"
                              onClick={() =>
                                window.open(`/companies/${org.slug}`, "_blank")
                              }
                            >
                              View Public Page
                            </MenuItem>
                            <MenuItem
                              icon={org.isActive ? <FiX /> : <FiCheck />}
                              onClick={() =>
                                updateMutation.mutate({
                                  id: org.id,
                                  data: { isActive: !org.isActive },
                                })
                              }
                              _hover={{ bg: "whiteAlpha.100" }}
                              color="white"
                            >
                              {org.isActive ? "Deactivate" : "Activate"}
                            </MenuItem>
                            <MenuItem
                              icon={<FiTrash2 />}
                              onClick={() => {
                                if (
                                  confirm(
                                    "Are you sure? This will delete all associated jobs.",
                                  )
                                ) {
                                  deleteMutation.mutate(org.id);
                                }
                              }}
                              _hover={{ bg: "whiteAlpha.100" }}
                              color="red.400"
                            >
                              Delete
                            </MenuItem>
                          </MenuList>
                        </Menu>
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
