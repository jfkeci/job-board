"use client";

import {
  Box,
  Flex,
  VStack,
  HStack,
  Text,
  Input,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Badge,
  useToast,
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
  Spinner,
  GlassCard,
  GlassButton,
} from "@job-board/ui";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  FiMoreVertical,
  FiPlus,
  FiEdit,
  FiTrash2,
  FiCheck,
  FiX,
  FiSettings,
} from "react-icons/fi";

import { adminApi, type Tenant } from "@/lib/api";

export default function TenantsPage() {
  const toast = useToast();
  const queryClient = useQueryClient();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);
  const [formData, setFormData] = useState({ name: "", slug: "", domain: "" });
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-tenants", page],
    queryFn: () => adminApi.getTenants({ page, limit: 50 }),
  });

  const createMutation = useMutation({
    mutationFn: adminApi.createTenant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-tenants"] });
      toast({ title: "Tenant created", status: "success", duration: 3000 });
      handleCloseModal();
    },
    onError: () => {
      toast({
        title: "Failed to create tenant",
        status: "error",
        duration: 3000,
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<{ name: string; domain: string; isActive: boolean }>;
    }) => adminApi.updateTenant(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-tenants"] });
      toast({ title: "Tenant updated", status: "success", duration: 3000 });
      handleCloseModal();
    },
    onError: () => {
      toast({
        title: "Failed to update tenant",
        status: "error",
        duration: 3000,
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: adminApi.deleteTenant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-tenants"] });
      toast({ title: "Tenant deleted", status: "success", duration: 3000 });
    },
    onError: () => {
      toast({
        title: "Failed to delete tenant",
        status: "error",
        duration: 3000,
      });
    },
  });

  const handleOpenCreate = () => {
    setEditingTenant(null);
    setFormData({ name: "", slug: "", domain: "" });
    onOpen();
  };

  const handleOpenEdit = (tenant: Tenant) => {
    setEditingTenant(tenant);
    setFormData({
      name: tenant.name,
      slug: tenant.slug,
      domain: tenant.domain || "",
    });
    onOpen();
  };

  const handleCloseModal = () => {
    setEditingTenant(null);
    setFormData({ name: "", slug: "", domain: "" });
    onClose();
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.slug) {
      toast({
        title: "Name and slug are required",
        status: "warning",
        duration: 3000,
      });
      return;
    }

    if (editingTenant) {
      updateMutation.mutate({
        id: editingTenant.id,
        data: {
          name: formData.name,
          domain: formData.domain || undefined,
        },
      });
    } else {
      createMutation.mutate({
        name: formData.name,
        slug: formData.slug,
        domain: formData.domain || undefined,
      });
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const tenants = data?.data || [];
  const totalPages = data?.totalPages || 1;

  return (
    <VStack align="stretch" spacing={6}>
      <Flex justify="space-between" align="center">
        <Box>
          <Text fontSize="2xl" fontWeight="bold" color="white">
            Tenants
          </Text>
          <Text color="whiteAlpha.600" fontSize="sm">
            Manage multi-tenant deployments and configurations
          </Text>
        </Box>
        <GlassButton leftIcon={<FiPlus />} onClick={handleOpenCreate}>
          Add Tenant
        </GlassButton>
      </Flex>

      <GlassCard>
        <VStack align="stretch" spacing={4} p={4}>
          {/* Table */}
          {isLoading ? (
            <Flex justify="center" py={8}>
              <Spinner color="white" />
            </Flex>
          ) : tenants.length === 0 ? (
            <Box textAlign="center" py={8}>
              <Text color="whiteAlpha.600">No tenants found</Text>
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
                      Domain
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
                  {tenants.map((tenant) => (
                    <Box
                      as="tr"
                      key={tenant.id}
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
                        {tenant.name}
                      </Box>
                      <Box as="td" py={3} px={4} color="whiteAlpha.600">
                        {tenant.slug}
                      </Box>
                      <Box as="td" py={3} px={4} color="whiteAlpha.800">
                        {tenant.domain || "-"}
                      </Box>
                      <Box as="td" py={3} px={4}>
                        <Badge colorScheme={tenant.isActive ? "green" : "red"}>
                          {tenant.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </Box>
                      <Box as="td" py={3} px={4} color="whiteAlpha.600">
                        {new Date(tenant.createdAt).toLocaleDateString()}
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
                              icon={<FiEdit />}
                              onClick={() => handleOpenEdit(tenant)}
                              _hover={{ bg: "whiteAlpha.100" }}
                              color="white"
                            >
                              Edit
                            </MenuItem>
                            <MenuItem
                              icon={<FiSettings />}
                              _hover={{ bg: "whiteAlpha.100" }}
                              color="white"
                            >
                              Configure Settings
                            </MenuItem>
                            <MenuItem
                              icon={tenant.isActive ? <FiX /> : <FiCheck />}
                              onClick={() =>
                                updateMutation.mutate({
                                  id: tenant.id,
                                  data: { isActive: !tenant.isActive },
                                })
                              }
                              _hover={{ bg: "whiteAlpha.100" }}
                              color="white"
                            >
                              {tenant.isActive ? "Deactivate" : "Activate"}
                            </MenuItem>
                            <MenuItem
                              icon={<FiTrash2 />}
                              onClick={() => {
                                if (
                                  confirm(
                                    "Are you sure? This will affect all data associated with this tenant.",
                                  )
                                ) {
                                  deleteMutation.mutate(tenant.id);
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

      {/* Create/Edit Modal */}
      <Modal isOpen={isOpen} onClose={handleCloseModal}>
        <ModalOverlay />
        <ModalContent bg="gray.800" color="white">
          <ModalHeader>
            {editingTenant ? "Edit Tenant" : "Create Tenant"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Name</FormLabel>
                <Input
                  value={formData.name}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      name: e.target.value,
                      slug: editingTenant
                        ? prev.slug
                        : generateSlug(e.target.value),
                    }));
                  }}
                  placeholder="e.g., Acme Corp Jobs"
                  bg="whiteAlpha.100"
                  border="none"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Slug</FormLabel>
                <Input
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, slug: e.target.value }))
                  }
                  placeholder="e.g., acme-corp"
                  bg="whiteAlpha.100"
                  border="none"
                  isDisabled={!!editingTenant}
                />
                {editingTenant && (
                  <Text fontSize="xs" color="whiteAlpha.500" mt={1}>
                    Slug cannot be changed after creation
                  </Text>
                )}
              </FormControl>

              <FormControl>
                <FormLabel>Custom Domain</FormLabel>
                <Input
                  value={formData.domain}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, domain: e.target.value }))
                  }
                  placeholder="e.g., jobs.acme.com"
                  bg="whiteAlpha.100"
                  border="none"
                />
                <Text fontSize="xs" color="whiteAlpha.500" mt={1}>
                  Optional custom domain for this tenant
                </Text>
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <HStack spacing={3}>
              <GlassButton variant="ghost" onClick={handleCloseModal}>
                Cancel
              </GlassButton>
              <GlassButton
                onClick={handleSubmit}
                isLoading={createMutation.isPending || updateMutation.isPending}
              >
                {editingTenant ? "Save Changes" : "Create Tenant"}
              </GlassButton>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
}
