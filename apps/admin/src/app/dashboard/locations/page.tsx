"use client";

import {
  Box,
  Flex,
  VStack,
  HStack,
  Text,
  Input,
  Select,
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
import { FiMoreVertical, FiPlus, FiEdit, FiTrash2 } from "react-icons/fi";

import { adminApi, type Location } from "@/lib/api";

const locationTypes = ["CITY", "STATE", "COUNTRY", "REGION"];

const typeColors: Record<string, string> = {
  CITY: "blue",
  STATE: "green",
  COUNTRY: "purple",
  REGION: "orange",
};

export default function LocationsPage() {
  const toast = useToast();
  const queryClient = useQueryClient();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    type: "CITY",
  });
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-locations", page],
    queryFn: () => adminApi.getLocations({ page, limit: 50 }),
  });

  const createMutation = useMutation({
    mutationFn: adminApi.createLocation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-locations"] });
      toast({ title: "Location created", status: "success", duration: 3000 });
      handleCloseModal();
    },
    onError: () => {
      toast({
        title: "Failed to create location",
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
      data: Partial<{ name: string; slug: string; type: string }>;
    }) => adminApi.updateLocation(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-locations"] });
      toast({ title: "Location updated", status: "success", duration: 3000 });
      handleCloseModal();
    },
    onError: () => {
      toast({
        title: "Failed to update location",
        status: "error",
        duration: 3000,
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: adminApi.deleteLocation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-locations"] });
      toast({ title: "Location deleted", status: "success", duration: 3000 });
    },
    onError: () => {
      toast({
        title: "Failed to delete location",
        status: "error",
        duration: 3000,
      });
    },
  });

  const handleOpenCreate = () => {
    setEditingLocation(null);
    setFormData({ name: "", slug: "", type: "CITY" });
    onOpen();
  };

  const handleOpenEdit = (location: Location) => {
    setEditingLocation(location);
    setFormData({
      name: location.name,
      slug: location.slug,
      type: location.type,
    });
    onOpen();
  };

  const handleCloseModal = () => {
    setEditingLocation(null);
    setFormData({ name: "", slug: "", type: "CITY" });
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

    if (editingLocation) {
      updateMutation.mutate({
        id: editingLocation.id,
        data: formData,
      });
    } else {
      createMutation.mutate(formData);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const locations = data?.data || [];
  const totalPages = data?.totalPages || 1;

  return (
    <VStack align="stretch" spacing={6}>
      <Flex justify="space-between" align="center">
        <Box>
          <Text fontSize="2xl" fontWeight="bold" color="white">
            Locations
          </Text>
          <Text color="whiteAlpha.600" fontSize="sm">
            Manage cities, regions, and countries for job listings
          </Text>
        </Box>
        <GlassButton leftIcon={<FiPlus />} onClick={handleOpenCreate}>
          Add Location
        </GlassButton>
      </Flex>

      <GlassCard>
        <VStack align="stretch" spacing={4} p={4}>
          {/* Table */}
          {isLoading ? (
            <Flex justify="center" py={8}>
              <Spinner color="white" />
            </Flex>
          ) : locations.length === 0 ? (
            <Box textAlign="center" py={8}>
              <Text color="whiteAlpha.600">No locations found</Text>
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
                      Type
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
                      textAlign="right"
                      color="whiteAlpha.600"
                      fontWeight="medium"
                    >
                      Actions
                    </Box>
                  </Box>
                </Box>
                <Box as="tbody">
                  {locations.map((location) => (
                    <Box
                      as="tr"
                      key={location.id}
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
                        {location.name}
                      </Box>
                      <Box as="td" py={3} px={4} color="whiteAlpha.600">
                        {location.slug}
                      </Box>
                      <Box as="td" py={3} px={4}>
                        <Badge
                          colorScheme={typeColors[location.type] || "gray"}
                        >
                          {location.type}
                        </Badge>
                      </Box>
                      <Box
                        as="td"
                        py={3}
                        px={4}
                        textAlign="center"
                        color="whiteAlpha.800"
                      >
                        {location._count?.jobs || 0}
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
                              onClick={() => handleOpenEdit(location)}
                              _hover={{ bg: "whiteAlpha.100" }}
                              color="white"
                            >
                              Edit
                            </MenuItem>
                            <MenuItem
                              icon={<FiTrash2 />}
                              onClick={() => {
                                if (
                                  confirm(
                                    "Are you sure? Jobs using this location will be unassigned.",
                                  )
                                ) {
                                  deleteMutation.mutate(location.id);
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
            {editingLocation ? "Edit Location" : "Create Location"}
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
                      slug: editingLocation
                        ? prev.slug
                        : generateSlug(e.target.value),
                    }));
                  }}
                  placeholder="e.g., New York City"
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
                  placeholder="e.g., new-york-city"
                  bg="whiteAlpha.100"
                  border="none"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Type</FormLabel>
                <Select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, type: e.target.value }))
                  }
                  bg="whiteAlpha.100"
                  border="none"
                >
                  {locationTypes.map((type) => (
                    <option
                      key={type}
                      value={type}
                      style={{ background: "#1a1a2e" }}
                    >
                      {type}
                    </option>
                  ))}
                </Select>
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
                {editingLocation ? "Save Changes" : "Create Location"}
              </GlassButton>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
}
