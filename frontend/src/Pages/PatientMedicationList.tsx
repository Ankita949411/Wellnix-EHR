import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Search, Plus, Edit, Trash2, ArrowLeft, Pill, Clock } from "lucide-react";
import { medicationService } from "../services/medicationService";
import { PatientMedication } from "../types/medication";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../components/ui/table";
import { Button } from "../components/ui/button";
import DeleteModal from "../components/ui/DeleteModal";
import Sidebar from "../components/layout/Sidebar";

const PatientMedicationList: React.FC = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const [medications, setMedications] = useState<PatientMedication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, medication: null as PatientMedication | null });
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchMedications = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await medicationService.getPatientMedications(parseInt(patientId!), statusFilter);
      setMedications(response.data);
    } catch (error: any) {
      setError(error.message || "Failed to fetch patient medications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (patientId) {
      fetchMedications();
    }
  }, [patientId, statusFilter]);

  const handleDiscontinue = async () => {
    if (!deleteModal.medication) return;
    
    setDeleteLoading(true);
    try {
      await medicationService.discontinuePatientMedication(deleteModal.medication.id, "Discontinued by provider");
      fetchMedications();
      setDeleteModal({ isOpen: false, medication: null });
    } catch (error: any) {
      setError(error.message || "Failed to discontinue medication");
    } finally {
      setDeleteLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      active: "bg-green-100 text-green-800 border border-green-200",
      completed: "bg-blue-100 text-blue-800 border border-blue-200",
      discontinued: "bg-red-100 text-red-800 border border-red-200",
      paused: "bg-yellow-100 text-yellow-800 border border-yellow-200",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800 border border-gray-200";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <Sidebar />
        <div className="flex-1 flex justify-center items-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading medications...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-6 pb-0">
          <div className="mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
              <div className="flex items-center gap-4 mb-4">
                <Button
                  variant="outline"
                  onClick={() => navigate("/patients")}
                  className="flex items-center gap-2 hover:bg-gray-50"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Patients
                </Button>
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent mb-2">
                Patient Medications
              </h1>
              <p className="text-gray-600">
                Manage patient's current and past medications
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  >
                    <option value="">All Medications</option>
                    <option value="active">Active Only</option>
                    <option value="completed">Completed</option>
                    <option value="discontinued">Discontinued</option>
                    <option value="paused">Paused</option>
                  </select>
                  <Button 
                    onClick={() => navigate(`/medications/patient/${patientId}/add`)}
                    className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 whitespace-nowrap"
                  >
                    <Plus className="w-4 h-4" />
                    Prescribe Medication
                  </Button>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-teal-50 rounded-lg">
                  <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                  <span className="text-sm font-medium text-teal-700 whitespace-nowrap">
                    {medications.length} Medications
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
        </div>

        <div className="flex-1 p-6 pt-4 overflow-auto">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="overflow-x-auto">
              <Table className="min-w-full">
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-teal-50 via-cyan-50 to-blue-50 border-b border-teal-200">
                    <TableHead className="font-semibold text-gray-700 w-[200px]">Medication</TableHead>
                    <TableHead className="font-semibold text-gray-700 w-[120px]">Dosage</TableHead>
                    <TableHead className="font-semibold text-gray-700 w-[120px]">Frequency</TableHead>
                    <TableHead className="font-semibold text-gray-700 w-[100px]">Route</TableHead>
                    <TableHead className="font-semibold text-gray-700 w-[100px]">Start Date</TableHead>
                    <TableHead className="font-semibold text-gray-700 w-[100px]">Status</TableHead>
                    <TableHead className="font-semibold text-gray-700 w-[120px]">Provider</TableHead>
                    <TableHead className="font-semibold text-gray-700 w-[120px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {medications.map((medication, index) => (
                    <TableRow
                      key={medication.id}
                      className={`hover:bg-teal-50/50 transition-colors ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                      }`}
                    >
                      <TableCell>
                        <div className="font-medium text-gray-900">
                          {medication.medication?.genericName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {medication.medication?.brandName && `(${medication.medication.brandName})`}
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {medication.dosage}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {medication.frequency}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {medication.route}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {formatDate(medication.startDate)}
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 text-xs font-bold rounded capitalize ${getStatusBadge(medication.status)}`}>
                          {medication.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-gray-600">
                        Dr. {medication.provider?.firstName} {medication.provider?.lastName}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/medications/patient/edit/${medication.id}`)}
                            className="hover:bg-teal-50 hover:border-teal-400 transition-all group p-1"
                          >
                            <Edit className="w-4 h-4 text-teal-600 group-hover:scale-110 transition-transform" />
                          </Button>
                          {medication.status === "active" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setDeleteModal({ isOpen: true, medication })}
                              className="hover:bg-red-50 hover:border-red-400 text-red-600 hover:text-red-700 transition-all group p-1"
                            >
                              <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
        
        <DeleteModal
          isOpen={deleteModal.isOpen}
          onClose={() => setDeleteModal({ isOpen: false, medication: null })}
          onConfirm={handleDiscontinue}
          title="Discontinue Medication"
          message="Are you sure you want to discontinue this medication? This action cannot be undone."
          loading={deleteLoading}
        />
      </div>
    </div>
  );
};

export default PatientMedicationList;