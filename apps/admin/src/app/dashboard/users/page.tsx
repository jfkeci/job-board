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
  Select,
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
  FiUserCheck,
  FiUserX,
  FiLogIn,
  FiTrash2,
} from "react-icons/fi";

import { adminApi, type User } from "@/lib/api";

const roleColors: Record<string, string> = {
  USER: "blue",
  CLIENT: "green",
  CLIENT_ADMIN: "purple",
  ADMIN: "orange",
  SUPER_ADMIN: "red",
};

export default function UsersPage() {
  const toast = useToast();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-users", page, search, roleFilter],
    queryFn: () =>
      adminApi.getUsers({
        page,
        limit: 20,
        search: search || undefined,
        role: roleFilter || undefined,
      }),
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Pick<User, "role" | "isActive">>;
    }) => adminApi.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast({ title: "User updated", status: "success", duration: 3000 });
    },
    onError: () => {
      toast({
        title: "Failed to update user",
        status: "error",
        duration: 3000,
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: adminApi.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast({ title: "User deleted", status: "success", duration: 3000 });
    },
    onError: () => {
      toast({
        title: "Failed to delete user",
        status: "error",
        duration: 3000,
      });
    },
  });

  const impersonateMutation = useMutation({
    mutationFn: adminApi.impersonateUser,
    onSuccess: (data) => {
      // Open dashboard in new tab with impersonation tokens
      const params = new URLSearchParams({
        impersonate: "true",
        token: data.accessToken,
      });
      window.open(`http://localhost:3002?${params.toString()}`, "_blank");
      toast({
        title: `Impersonating ${data.user.email}`,
        status: "info",
        duration: 3000,
      });
    },
    onError: () => {
      toast({
        title: "Failed to impersonate user",
        status: "error",
        duration: 3000,
      });
    },
  });

  const users = data?.data || [];
  const totalPages = data?.totalPages || 1;

  return (
    <VStack align="stretch" spacing={6}>
      <Flex justify="space-between" align="center">
        <Box>
          <Text fontSize="2xl" fontWeight="bold" color="white">
            Users
          </Text>
          <Text color="whiteAlpha.600" fontSize="sm">
            Manage platform users and their roles
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
                placeholder="Search users..."
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

            <Select
              maxW="200px"
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setPage(1);
              }}
              bg="whiteAlpha.100"
              border="none"
              color="white"
            >
              <option value="" style={{ background: "#1a1a2e" }}>
                All Roles
              </option>
              <option value="USER" style={{ background: "#1a1a2e" }}>
                User
              </option>
              <option value="CLIENT" style={{ background: "#1a1a2e" }}>
                Client
              </option>
              <option value="CLIENT_ADMIN" style={{ background: "#1a1a2e" }}>
                Client Admin
              </option>
              <option value="ADMIN" style={{ background: "#1a1a2e" }}>
                Admin
              </option>
              <option value="SUPER_ADMIN" style={{ background: "#1a1a2e" }}>
                Super Admin
              </option>
            </Select>
          </HStack>

          {/* Table */}
          {isLoading ? (
            <Flex justify="center" py={8}>
              <Spinner color="white" />
            </Flex>
          ) : users.length === 0 ? (
            <Box textAlign="center" py={8}>
              <Text color="whiteAlpha.600">No users found</Text>
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
                      Email
                    </Box>
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
                      Role
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
                  {users.map((user) => (
                    <Box
                      as="tr"
                      key={user.id}
                      borderBottom="1px"
                      borderColor="whiteAlpha.50"
                      _hover={{ bg: "whiteAlpha.50" }}
                    >
                      <Box as="td" py={3} px={4} color="white">
                        {user.email}
                      </Box>
                      <Box as="td" py={3} px={4} color="whiteAlpha.800">
                        {user.firstName && user.lastName
                          ? `${user.firstName} ${user.lastName}`
                          : "-"}
                      </Box>
                      <Box as="td" py={3} px={4}>
                        <Badge colorScheme={roleColors[user.role] || "gray"}>
                          {user.role}
                        </Badge>
                      </Box>
                      <Box as="td" py={3} px={4}>
                        <Badge colorScheme={user.isActive ? "green" : "red"}>
                          {user.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </Box>
                      <Box as="td" py={3} px={4} color="whiteAlpha.600">
                        {new Date(user.createdAt).toLocaleDateString()}
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
                              icon={
                                user.isActive ? <FiUserX /> : <FiUserCheck />
                              }
                              onClick={() =>
                                updateMutation.mutate({
                                  id: user.id,
                                  data: { isActive: !user.isActive },
                                })
                              }
                              _hover={{ bg: "whiteAlpha.100" }}
                              color="white"
                            >
                              {user.isActive ? "Deactivate" : "Activate"}
                            </MenuItem>
                            <MenuItem
                              icon={<FiLogIn />}
                              onClick={() =>
                                impersonateMutation.mutate(user.id)
                              }
                              _hover={{ bg: "whiteAlpha.100" }}
                              color="white"
                            >
                              Impersonate
                            </MenuItem>
                            <MenuItem
                              icon={<FiTrash2 />}
                              onClick={() => {
                                if (
                                  confirm(
                                    "Are you sure you want to delete this user?",
                                  )
                                ) {
                                  deleteMutation.mutate(user.id);
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
