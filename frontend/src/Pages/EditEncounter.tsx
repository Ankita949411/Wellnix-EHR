import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Calendar, Stethoscope } from "lucide-react";
import { encounterService } from "../services/encounterService";
import { patientService } from "../services/patientService";
import { userService } from "../services/userService";
import { Encounter } from "../types/encounter";
import { Patient } from "../types/patient";
import { User } from "../types/user";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import Sidebar from "../components/layout/Sidebar";

const EditEncounter: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [providers, setProviders] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    patientId: 0,
    providerId: 0,
    encounterType: "consultation" as 'consultation' | 'follow-up' | 'emergency' | 'routine',
    encounterDate: "",
    chiefComplaint: "",
    historyOfPresentIllness: "",
    physicalExamination: "",
    assessment: "",
    plan: "",
    notes: "",
    status: "active" as 'active' | 'completed' | 'cancelled',
    duration: undefined as number | undefined,
  });

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const fetchData = async () => {
    try {
      setInitialLoading(true);
      setError(null);
      
      const [encounterResponse, patientsResponse, providersResponse] = await Promise.all([
        encounterService.getEncounterById(id!),
        patientService.getPatients(1, 100),
        userService.getUsers(1, 100)
      ]);

      const encounter = encounterResponse.data;
      setFormData({
        patientId: encounter.patient?.id || 0,
        providerId: encounter.provider?.id || 0,
        encounterType: encounter.encounterType,
        encounterDate: encounter.encounterDate.split('T')[0],
        chiefComplaint: encounter.chiefComplaint,
        historyOfPresentIllness: encounter.historyOfPresentIllness || "",
        physicalExamination: encounter.physicalExamination || "",
        assessment: encounter.assessment || "",
        plan: encounter.plan || "",
        notes: encounter.notes || "",
        status: encounter.status,
        duration: encounter.duration,
      });

      setPatients(patientsResponse.data.patients);
      setProviders(providersResponse.data.users.filter(user => 
        user.role === 'doctor' || user.role === 'nurse'
      ));
    } catch (error: any) {
      setError(error.message || "Failed to load encounter data");
    } finally {
      setInitialLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'patientId' || name === 'providerId' || name === 'duration' 
        ? (value ? Number(value) : undefined) 
        : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.patientId || !formData.providerId || !formData.chiefComplaint.trim()) {
      setError("Please fill in all required fields");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await encounterService.updateEncounter(id!, formData);
      navigate("/encounters");
    } catch (error: any) {
      setError(error.message || "Failed to update encounter");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <Sidebar />
        <div className="flex-1 flex justify-center items-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading encounter...</p>
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
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
            <div className="flex items-center gap-4 mb-8">
              <Button
                variant="outline"
                onClick={() => navigate("/encounters")}
                className="flex items-center gap-2 hover:bg-purple-50 hover:border-purple-300"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Encounters
              </Button>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Edit Encounter
                </h1>
                <p className="text-gray-600 mt-1">Update encounter information</p>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information */}
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-6 border border-purple-200">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  <h2 className="text-xl font-semibold text-purple-800">Basic Information</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Patient *
                    </label>
                    <select
                      name="patientId"
                      value={formData.patientId}
                      onChange={handleInputChange}
                      required
                      className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="">Select Patient</option>
                      {patients.map(patient => (
                        <option key={patient.id} value={patient.id}>
                          {patient.firstName} {patient.lastName} ({patient.patientId})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Provider *
                    </label>
                    <select
                      name="providerId"
                      value={formData.providerId}
                      onChange={handleInputChange}
                      required
                      className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="">Select Provider</option>
                      {providers.map(provider => (
                        <option key={provider.id} value={provider.id}>
                          {provider.firstName} {provider.lastName} ({provider.role})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Encounter Type *
                    </label>
                    <select
                      name="encounterType"
                      value={formData.encounterType}
                      onChange={handleInputChange}
                      required
                      className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="consultation">Consultation</option>
                      <option value="follow-up">Follow-up</option>
                      <option value="emergency">Emergency</option>
                      <option value="routine">Routine</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Encounter Date *
                    </label>
                    <Input
                      type="date"
                      name="encounterDate"
                      value={formData.encounterDate}
                      onChange={handleInputChange}
                      required
                      className="h-12 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration (minutes)
                    </label>
                    <Input
                      type="number"
                      name="duration"
                      value={formData.duration || ""}
                      onChange={handleInputChange}
                      placeholder="e.g., 30"
                      className="h-12 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Clinical Information */}
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-6 border border-blue-200">
                <div className="flex items-center gap-2 mb-4">
                  <Stethoscope className="w-5 h-5 text-blue-600" />
                  <h2 className="text-xl font-semibold text-blue-800">Clinical Information</h2>
                </div>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Chief Complaint *
                    </label>
                    <Input
                      name="chiefComplaint"
                      value={formData.chiefComplaint}
                      onChange={handleInputChange}
                      placeholder="Primary reason for the visit"
                      required
                      className="h-12 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      History of Present Illness
                    </label>
                    <textarea
                      name="historyOfPresentIllness"
                      value={formData.historyOfPresentIllness}
                      onChange={handleInputChange}
                      rows={4}
                      placeholder="Detailed history of the current condition"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Physical Examination
                    </label>
                    <textarea
                      name="physicalExamination"
                      value={formData.physicalExamination}
                      onChange={handleInputChange}
                      rows={4}
                      placeholder="Physical examination findings"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Assessment
                    </label>
                    <textarea
                      name="assessment"
                      value={formData.assessment}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="Clinical assessment and diagnosis"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Plan
                    </label>
                    <textarea
                      name="plan"
                      value={formData.plan}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="Treatment plan and recommendations"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Notes
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="Any additional notes or observations"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/encounters")}
                  className="px-8 py-3"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Save className="w-5 h-5" />
                  )}
                  {loading ? "Updating..." : "Update Encounter"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditEncounter;