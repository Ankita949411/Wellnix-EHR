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
import PageNavigation from "../components/navigation/PageNavigation";

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
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

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to deactivate this user?")) {
      try {
        await userService.deleteUser(id);
        fetchUsers();
      } catch (error: any) {
        setError(error.message || "Failed to delete user");
        console.error("Error deleting user:", error);
      }
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
        "bg-gradient-to-r from-red-100 to-red-200 text-red-800 border border-red-200",
      super_admin:
        "bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border border-purple-200",
      doctor:
        "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-200",
      nurse:
        "bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-200",
    };
    return (
      colors[role as keyof typeof colors] ||
      "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border border-gray-200"
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6">
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

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200">
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
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold">
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
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${getRoleBadge(
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
                        className="hover:bg-blue-50 hover:border-blue-300"
                      >
                        <Eye className="w-4 h-4 text-blue-600" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditUser(user)}
                        className="hover:bg-green-50 hover:border-green-300"
                      >
                        <Edit className="w-4 h-4 text-green-600" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(user.id)}
                        className="hover:bg-red-50 hover:border-red-300 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
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
        <PageNavigation backPath="/dashboard" />
      </div>
    </div>
  );
};

export default UserList;
