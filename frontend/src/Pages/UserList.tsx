import React, { useState, useEffect } from "react";
import { Search, Trash2, Eye, Plus, Edit } from "lucide-react";
import { userService } from "../services/userService";
import { User, UserListResponse, CreateUserDto } from "../types/user";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../components/ui/table";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import UserModal from "../components/users/UserModal";
import DeleteModal from "../components/ui/DeleteModal";
import Sidebar from "../components/layout/Sidebar";

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  console.log(users, "users");

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit" | "view">(
    "create"
  );
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, user: null as User | null });
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await userService.getUsers(page, 10, search);
      setUsers(response.data.users);
      setTotalPages(response.data.totalPages);
      setTotal(response.data.total);
    } catch (error: any) {
      setError(error.message || "Failed to fetch users");
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, [page, search]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    const validPage = Math.max(1, Math.min(newPage, totalPages));
    setPage(validPage);
  };

  const handleDeleteClick = (user: User) => {
    setDeleteModal({ isOpen: true, user });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.user) return;
    
    setDeleteLoading(true);
    try {
      await userService.deleteUser(deleteModal.user.id);
      fetchUsers();
      setDeleteModal({ isOpen: false, user: null });
    } catch (error: any) {
      setError(error.message || "Failed to delete user");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleCreateUser = () => {
    setSelectedUser(null);
    setModalMode("create");
    setModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setModalMode("edit");
    setModalOpen(true);
  };

  const handleViewUser = async (id: number) => {
    try {
      const response = await userService.getUserById(id);
      setSelectedUser(response.data);
      setModalMode("view");
      setModalOpen(true);
    } catch (error: any) {
      setError(error.message || "Failed to fetch user details");
    }
  };

  const handleSaveUser = async (userData: CreateUserDto | Partial<User>) => {
    try {
      if (modalMode === "create") {
        await userService.createUser(userData as CreateUserDto);
      } else if (modalMode === "edit" && selectedUser) {
        await userService.updateUser(selectedUser.id, userData);
      }
      fetchUsers();
      setModalOpen(false);
    } catch (error: any) {
      setError(error.message || "Failed to save user");
      throw error;
    }
  };

  const getRoleBadge = (role: string) => {
    const colors = {
      admin:
        "bg-gradient-to-r from-red-100 via-red-200 to-red-300 text-red-900 border-2 border-red-300 shadow-md",
      super_admin:
        "bg-gradient-to-r from-purple-100 via-purple-200 to-purple-300 text-purple-900 border-2 border-purple-300 shadow-md",
      doctor:
        "bg-gradient-to-r from-blue-100 via-blue-200 to-blue-300 text-blue-900 border-2 border-blue-300 shadow-md",
      nurse:
        "bg-gradient-to-r from-green-100 via-green-200 to-green-300 text-green-900 border-2 border-green-300 shadow-md",
    };
    return (
      colors[role as keyof typeof colors] ||
      "bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300 text-gray-900 border-2 border-gray-300 shadow-md"
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex justify-center items-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Sidebar />
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
              User Management
            </h1>
            <p className="text-gray-600">
              Manage system users and their permissions
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Search by name..."
                    value={search}
                    onChange={handleSearch}
                    className="pl-12 w-80 h-12 border-gray-200 focus:border-blue-400 focus:ring-blue-400 rounded-lg"
                  />
                </div>
                <Button
                  onClick={handleCreateUser}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4" />
                  Add User
                </Button>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium text-blue-700">
                  {total} Active Users
                </span>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
          <Table>
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-b border-blue-200">
                <TableHead className="font-semibold text-gray-700">
                  Name
                </TableHead>
                <TableHead className="font-semibold text-gray-700">
                  Email
                </TableHead>
                <TableHead className="font-semibold text-gray-700">
                  Role
                </TableHead>
                <TableHead className="font-semibold text-gray-700">
                  Department
                </TableHead>
                <TableHead className="font-semibold text-gray-700">
                  License
                </TableHead>
                <TableHead className="font-semibold text-gray-700">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user, index) => (
                <TableRow
                  key={user.id}
                  className={`hover:bg-blue-50/50 transition-colors ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                  }`}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg ring-2 ring-blue-200">
                        {user.firstName.charAt(0)}
                        {user.lastName.charAt(0)}
                      </div>
                      <div className="font-medium text-gray-900">
                        {user.firstName} {user.lastName}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600">{user.email}</TableCell>
                  <TableCell>
                    <span
                      className={`px-4 py-2 text-xs font-bold rounded-full shadow-sm ${getRoleBadge(
                        user.role
                      )}`}
                    >
                      {user.role.replace("_", " ").toUpperCase()}
                    </span>
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {user.department || "-"}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {user.licenseNumber || "-"}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewUser(user.id)}
                        className="hover:bg-blue-50 hover:border-blue-400 hover:shadow-md transition-all duration-200 group"
                      >
                        <Eye className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditUser(user)}
                        className="hover:bg-green-50 hover:border-green-400 hover:shadow-md transition-all duration-200 group"
                      >
                        <Edit className="w-4 h-4 text-green-600 group-hover:scale-110 transition-transform" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteClick(user)}
                        className="hover:bg-red-50 hover:border-red-400 text-red-600 hover:text-red-700 hover:shadow-md transition-all duration-200 group"
                      >
                        <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-6">
            <div className="flex justify-center items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="px-6 py-2 disabled:opacity-50 hover:bg-blue-50 hover:border-blue-300"
              >
                Previous
              </Button>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Page</span>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg font-semibold">
                  {page}
                </span>
                <span className="text-sm text-gray-600">of {totalPages}</span>
              </div>
              <Button
                variant="outline"
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className="px-6 py-2 disabled:opacity-50 hover:bg-blue-50 hover:border-blue-300"
              >
                Next
              </Button>
            </div>
          </div>
        )}

        <UserModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleSaveUser}
          user={selectedUser}
          mode={modalMode}
        />
        
        <DeleteModal
          isOpen={deleteModal.isOpen}
          onClose={() => setDeleteModal({ isOpen: false, user: null })}
          onConfirm={handleDeleteConfirm}
          title="Delete User"
          message={`Are you sure you want to deactivate ${deleteModal.user?.firstName} ${deleteModal.user?.lastName}? This action cannot be undone.`}
          loading={deleteLoading}
        />
        </div>
      </div>
    </div>
  );
};

export default UserList;
