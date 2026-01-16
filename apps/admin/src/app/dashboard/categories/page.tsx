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
  Textarea,
  Spinner,
  GlassCard,
  GlassButton,
} from "@job-board/ui";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FiMoreVertical, FiPlus, FiEdit, FiTrash2 } from "react-icons/fi";

import { adminApi, type Category } from "@/lib/api";

export default function CategoriesPage() {
  const toast = useToast();
  const queryClient = useQueryClient();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
  });
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-categories", page],
    queryFn: () => adminApi.getCategories({ page, limit: 50 }),
  });

  const createMutation = useMutation({
    mutationFn: adminApi.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      toast({ title: "Category created", status: "success", duration: 3000 });
      handleCloseModal();
    },
    onError: () => {
      toast({
        title: "Failed to create category",
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
      data: Partial<{ name: string; slug: string; description: string }>;
    }) => adminApi.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      toast({ title: "Category updated", status: "success", duration: 3000 });
      handleCloseModal();
    },
    onError: () => {
      toast({
        title: "Failed to update category",
        status: "error",
        duration: 3000,
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: adminApi.deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      toast({ title: "Category deleted", status: "success", duration: 3000 });
    },
    onError: () => {
      toast({
        title: "Failed to delete category",
        status: "error",
        duration: 3000,
      });
    },
  });

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setFormData({ name: "", slug: "", description: "" });
    onOpen();
  };

  const handleOpenEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || "",
    });
    onOpen();
  };

  const handleCloseModal = () => {
    setEditingCategory(null);
    setFormData({ name: "", slug: "", description: "" });
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

    if (editingCategory) {
      updateMutation.mutate({
        id: editingCategory.id,
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

  const categories = data?.data || [];
  const totalPages = data?.totalPages || 1;

  return (
    <VStack align="stretch" spacing={6}>
      <Flex justify="space-between" align="center">
        <Box>
          <Text fontSize="2xl" fontWeight="bold" color="white">
            Categories
          </Text>
          <Text color="whiteAlpha.600" fontSize="sm">
            Manage job categories and classifications
          </Text>
        </Box>
        <GlassButton leftIcon={<FiPlus />} onClick={handleOpenCreate}>
          Add Category
        </GlassButton>
      </Flex>

      <GlassCard>
        <VStack align="stretch" spacing={4} p={4}>
          {/* Table */}
          {isLoading ? (
            <Flex justify="center" py={8}>
              <Spinner color="white" />
            </Flex>
          ) : categories.length === 0 ? (
            <Box textAlign="center" py={8}>
              <Text color="whiteAlpha.600">No categories found</Text>
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
                      Description
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
                  {categories.map((category) => (
                    <Box
                      as="tr"
                      key={category.id}
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
                        {category.name}
                      </Box>
                      <Box as="td" py={3} px={4} color="whiteAlpha.600">
                        {category.slug}
                      </Box>
                      <Box
                        as="td"
                        py={3}
                        px={4}
                        color="whiteAlpha.800"
                        maxW="300px"
                        isTruncated
                      >
                        {category.description || "-"}
                      </Box>
                      <Box
                        as="td"
                        py={3}
                        px={4}
                        textAlign="center"
                        color="whiteAlpha.800"
                      >
                        {category._count?.jobs || 0}
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
                              onClick={() => handleOpenEdit(category)}
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
                                    "Are you sure? Jobs using this category will be unassigned.",
                                  )
                                ) {
                                  deleteMutation.mutate(category.id);
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
            {editingCategory ? "Edit Category" : "Create Category"}
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
                      slug: editingCategory
                        ? prev.slug
                        : generateSlug(e.target.value),
                    }));
                  }}
                  placeholder="e.g., Information Technology"
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
                  placeholder="e.g., information-technology"
                  bg="whiteAlpha.100"
                  border="none"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Description</FormLabel>
                <Textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Brief description of this category"
                  bg="whiteAlpha.100"
                  border="none"
                  rows={3}
                />
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
                {editingCategory ? "Save Changes" : "Create Category"}
              </GlassButton>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
}
