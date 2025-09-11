import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { patientService } from "../services/patientService";
import { Patient } from "../types/patient";
import { Button } from "../components/ui/button";
import DeleteModal from "../components/ui/DeleteModal";
import Sidebar from "../components/layout/Sidebar";

const ViewPatient: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchPatient();
    }
  }, [id]);

  const fetchPatient = async () => {
    try {
      const response = await patientService.getPatientById(Number(id));
      setPatient(response.data);
    } catch (error: any) {
      setError(error.message || "Failed to fetch patient");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = () => {
    setDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    setDeleteLoading(true);
    try {
      await patientService.deletePatient(Number(id));
      navigate("/patients");
    } catch (error: any) {
      setError(error.message || "Failed to delete patient");
    } finally {
      setDeleteLoading(false);
    }
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
            <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading patient...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <Sidebar />
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <p className="text-red-700">{error || "Patient not found"}</p>
              <Button
                onClick={() => navigate("/patients")}
                className="mt-4"
              >
                Back to Patients
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Sidebar />
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="outline"
                onClick={() => navigate("/patients")}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Patients
              </Button>
              <div className="flex gap-2">
                <Button
                  onClick={() => navigate(`/patients/edit/${patient.id}`)}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </Button>
                <Button
                  onClick={handleDeleteClick}
                  variant="outline"
                  className="flex items-center gap-2 text-red-600 hover:bg-red-50 hover:border-red-300"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </Button>
              </div>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent mb-2">
              Patient Details
            </h1>
            <p className="text-gray-600">Patient ID: {patient.patientId}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-white to-green-50 rounded-xl shadow-lg border border-green-100 p-8 hover:shadow-xl transition-all duration-300">
              <h3 className="text-xl font-bold text-green-800 border-b-2 border-green-300 pb-3 mb-6 flex items-center gap-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">P</span>
                </div>
                Personal Information
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Full Name</label>
                  <p className="text-gray-900 font-semibold text-lg">{patient.firstName} {patient.lastName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Date of Birth</label>
                  <p className="text-gray-900">{formatDate(patient.dateOfBirth)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Gender</label>
                  <p className="text-gray-900 capitalize">{patient.gender}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Blood Type</label>
                  <p className="text-red-600 font-bold text-lg">{patient.bloodType || "Not specified"}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-lg border border-blue-100 p-8 hover:shadow-xl transition-all duration-300">
              <h3 className="text-xl font-bold text-blue-800 border-b-2 border-blue-300 pb-3 mb-6 flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">C</span>
                </div>
                Contact Information
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Phone</label>
                  <p className="text-gray-900">{patient.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-gray-900">{patient.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Address</label>
                  <p className="text-gray-900">{patient.address}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Emergency Contact</label>
                  <p className="text-gray-900">{patient.emergencyContact || "Not specified"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Emergency Phone</label>
                  <p className="text-gray-900">{patient.emergencyPhone || "Not specified"}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-purple-50 rounded-xl shadow-lg border border-purple-100 p-8 mt-8 hover:shadow-xl transition-all duration-300">
            <h3 className="text-xl font-bold text-purple-800 border-b-2 border-purple-300 pb-3 mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">M</span>
              </div>
              Medical Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-500">Allergies</label>
                <p className="text-gray-900 mt-1">{patient.allergies || "No known allergies"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Medical History</label>
                <p className="text-gray-900 mt-1">{patient.medicalHistory || "No medical history recorded"}</p>
              </div>
            </div>
          </div>
          
          <DeleteModal
            isOpen={deleteModal}
            onClose={() => setDeleteModal(false)}
            onConfirm={handleDeleteConfirm}
            title="Delete Patient"
            message={`Are you sure you want to deactivate ${patient?.firstName} ${patient?.lastName}? This action cannot be undone.`}
            loading={deleteLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default ViewPatient;