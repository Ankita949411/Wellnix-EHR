import React, { useState, useEffect } from "react";
import { Search, Trash2, Eye, Plus, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { patientService } from "../services/patientService";
import { Patient, CreatePatientDto } from "../types/patient";
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
import DeleteModal from "../components/ui/DeleteModal";
import Sidebar from "../components/layout/Sidebar";

const PatientList: React.FC = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, patient: null as Patient | null });
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await patientService.getPatients(page, 10, search);
      setPatients(response.data.patients);
      setTotalPages(response.data.totalPages);
      setTotal(response.data.total);
    } catch (error: any) {
      setError(error.message || "Failed to fetch patients");
      console.error("Error fetching patients:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, [page, search]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    const validPage = Math.max(1, Math.min(newPage, totalPages));
    setPage(validPage);
  };

  const handleDeleteClick = (patient: Patient) => {
    setDeleteModal({ isOpen: true, patient });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.patient) return;
    
    setDeleteLoading(true);
    try {
      await patientService.deletePatient(deleteModal.patient.id);
      fetchPatients();
      setDeleteModal({ isOpen: false, patient: null });
    } catch (error: any) {
      setError(error.message || "Failed to delete patient");
    } finally {
      setDeleteLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getGenderBadge = (gender: string) => {
    const colors = {
      male: "bg-blue-100 text-blue-800 border border-blue-200",
      female: "bg-pink-100 text-pink-800 border border-pink-200",
      other: "bg-gray-100 text-gray-800 border border-gray-200",
    };
    return colors[gender as keyof typeof colors] || "bg-gray-100 text-gray-800 border border-gray-200";
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <Sidebar />
        <div className="flex-1 flex justify-center items-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading patients...</p>
          </div>
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
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent mb-2">
                Patient Management
              </h1>
              <p className="text-gray-600">
                Manage patient records and medical information
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-400 w-5 h-5" />
                    <Input
                      type="text"
                      placeholder="Search by name or patient ID..."
                      value={search}
                      onChange={handleSearch}
                      className="pl-12 w-80 h-12 border-gray-200 focus:border-green-400 focus:ring-green-400 rounded-lg"
                    />
                  </div>
                  <Button 
                    onClick={() => navigate('/patients/add')}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                  >
                    <Plus className="w-4 h-4" />
                    Add Patient
                  </Button>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-green-700">
                    {total} Active Patients
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
                <TableRow className="bg-gradient-to-r from-green-50 via-teal-50 to-emerald-50 border-b border-green-200">
                  <TableHead className="font-semibold text-gray-700">Patient ID</TableHead>
                  <TableHead className="font-semibold text-gray-700">Name</TableHead>
                  <TableHead className="font-semibold text-gray-700">Gender</TableHead>
                  <TableHead className="font-semibold text-gray-700">Date of Birth</TableHead>
                  <TableHead className="font-semibold text-gray-700">Phone</TableHead>
                  <TableHead className="font-semibold text-gray-700">Email</TableHead>
                  <TableHead className="font-semibold text-gray-700">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patients.map((patient, index) => (
                  <TableRow
                    key={patient.id}
                    className={`hover:bg-green-50/50 transition-colors ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                    }`}
                  >
                    <TableCell className="font-bold text-green-800 bg-green-50 rounded-lg px-3 py-1">
                      {patient.patientId}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-400 via-teal-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg ring-2 ring-green-200">
                          {patient.firstName.charAt(0)}
                          {patient.lastName.charAt(0)}
                        </div>
                        <div className="font-medium text-gray-900">
                          {patient.firstName} {patient.lastName}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`px-4 py-2 text-xs font-bold rounded-full shadow-sm ${getGenderBadge(patient.gender)}`}>
                        {patient.gender.toUpperCase()}
                      </span>
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {formatDate(patient.dateOfBirth)}
                    </TableCell>
                    <TableCell className="text-gray-600">{patient.phone}</TableCell>
                    <TableCell className="text-gray-600">{patient.email}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/patients/${patient.id}`)}
                          className="hover:bg-green-50 hover:border-green-400 hover:shadow-md transition-all duration-200 group"
                        >
                          <Eye className="w-4 h-4 text-green-600 group-hover:scale-110 transition-transform" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/patients/edit/${patient.id}`)}
                          className="hover:bg-blue-50 hover:border-blue-400 hover:shadow-md transition-all duration-200 group"
                        >
                          <Edit className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteClick(patient)}
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
                  className="px-6 py-2 disabled:opacity-50 hover:bg-green-50 hover:border-green-300"
                >
                  Previous
                </Button>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Page</span>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg font-semibold">
                    {page}
                  </span>
                  <span className="text-sm text-gray-600">of {totalPages}</span>
                </div>
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                  className="px-6 py-2 disabled:opacity-50 hover:bg-green-50 hover:border-green-300"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
          
          <DeleteModal
            isOpen={deleteModal.isOpen}
            onClose={() => setDeleteModal({ isOpen: false, patient: null })}
            onConfirm={handleDeleteConfirm}
            title="Delete Patient"
            message={`Are you sure you want to deactivate ${deleteModal.patient?.firstName} ${deleteModal.patient?.lastName}? This action cannot be undone.`}
            loading={deleteLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default PatientList;