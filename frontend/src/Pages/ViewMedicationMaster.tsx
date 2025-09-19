import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Pill, ArrowLeft, Edit } from "lucide-react";
import { medicationService } from "../services/medicationService";
import { MedicationMaster } from "../types/medication";
import { Button } from "../components/ui/button";
import Sidebar from "../components/layout/Sidebar";

const ViewMedicationMaster: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [medication, setMedication] = useState<MedicationMaster | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchMedication();
    }
  }, [id]);

  const fetchMedication = async () => {
    try {
      setLoading(true);
      const response = await medicationService.getMedicationMasterById(id!);
      setMedication(response.data);
    } catch (error: any) {
      setError(error.message || "Failed to fetch medication");
    } finally {
      setLoading(false);
    }
  };

  const getClassificationBadge = (classification: string) => {
    const colors = {
      antibiotic: "bg-red-100 text-red-800 border border-red-200",
      analgesic: "bg-blue-100 text-blue-800 border border-blue-200",
      antihypertensive: "bg-green-100 text-green-800 border border-green-200",
      antidiabetic: "bg-purple-100 text-purple-800 border border-purple-200",
      antihistamine: "bg-yellow-100 text-yellow-800 border border-yellow-200",
      other: "bg-gray-100 text-gray-800 border border-gray-200",
    };
    return colors[classification as keyof typeof colors] || "bg-gray-100 text-gray-800 border border-gray-200";
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <Sidebar />
        <div className="flex-1 flex justify-center items-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading medication...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !medication) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <Sidebar />
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <p className="text-red-700">{error || "Medication not found"}</p>
              <Button
                onClick={() => navigate("/medications")}
                className="mt-4"
                variant="outline"
              >
                Back to Medications
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
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => navigate("/medications")}
                  className="flex items-center gap-2 hover:bg-gray-50"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Medications
                </Button>
              </div>
              <Button
                onClick={() => navigate(`/medications/master/edit/${medication.id}`)}
                className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700"
              >
                <Edit className="w-4 h-4" />
                Edit
              </Button>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent mb-2">
              Medication Details
            </h1>
            <p className="text-gray-600">View medication information</p>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-6">
                <Pill className="w-5 h-5 text-teal-600" />
                <h2 className="text-xl font-semibold text-gray-800">Basic Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-500">Generic Name</label>
                  <p className="text-lg font-semibold text-gray-900 mt-1">{medication.genericName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Brand Name</label>
                  <p className="text-lg text-gray-900 mt-1">{medication.brandName || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Dosage Form</label>
                  <div className="mt-1">
                    <span className="px-3 py-1 text-sm font-medium bg-gray-100 text-gray-800 rounded capitalize">
                      {medication.dosageForm}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Strength</label>
                  <p className="text-lg text-gray-900 mt-1">{medication.strength}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Classification</label>
                  <div className="mt-1">
                    <span className={`px-3 py-1 text-sm font-bold rounded capitalize ${getClassificationBadge(medication.classification)}`}>
                      {medication.classification}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Manufacturer</label>
                  <p className="text-lg text-gray-900 mt-1">{medication.manufacturer || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <div className="mt-1">
                    <span className={`px-3 py-1 text-sm font-bold rounded ${
                      medication.isActive 
                        ? "bg-green-100 text-green-800 border border-green-200" 
                        : "bg-red-100 text-red-800 border border-red-200"
                    }`}>
                      {medication.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Created Date</label>
                  <p className="text-lg text-gray-900 mt-1">
                    {new Date(medication.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {medication.description && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Description</h2>
                <p className="text-gray-700 leading-relaxed">{medication.description}</p>
              </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Audit Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-500">Created At</label>
                  <p className="text-gray-900 mt-1">
                    {new Date(medication.createdAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Last Updated</label>
                  <p className="text-gray-900 mt-1">
                    {new Date(medication.updatedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewMedicationMaster;