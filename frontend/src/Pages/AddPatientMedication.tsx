import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Pill, Save, ArrowLeft, Search } from "lucide-react";
import { medicationService } from "../services/medicationService";
import { patientService } from "../services/patientService";
import { userService } from "../services/userService";
import { CreatePatientMedicationData, MedicationMaster } from "../types/medication";
import { Patient } from "../types/patient";
import { User, UserRole } from "../types/user";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import Sidebar from "../components/layout/Sidebar";

const AddPatientMedication: React.FC = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [medications, setMedications] = useState<MedicationMaster[]>([]);
  const [providers, setProviders] = useState<User[]>([]);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreatePatientMedicationData>({
    patientId: parseInt(patientId!),
    medicationId: "",
    providerId: 0,
    dosage: "",
    frequency: "",
    route: "oral",
    startDate: new Date().toISOString().split('T')[0],
    reason: "",
    instructions: "",
    status: "active",
  });

  useEffect(() => {
    fetchData();
  }, [patientId]);

  const fetchData = async () => {
    try {
      const [medicationsResponse, providersResponse] = await Promise.all([
        medicationService.getMedicationMaster(1, 100),
        userService.getUsers(1, 100),
      ]);
      setMedications(medicationsResponse.data.medications);
      setProviders(providersResponse.data.users.filter((user: User) => user.role === UserRole.DOCTOR));
    } catch (error: any) {
      setError("Failed to load data");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "providerId" ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.medicationId || !formData.providerId || !formData.dosage || !formData.frequency) {
      setError("Please fill in all required fields");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await medicationService.createPatientMedication(formData);
      navigate(`/medications/patient/${patientId}`);
    } catch (error: any) {
      setError(error.message || "Failed to prescribe medication");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Sidebar />
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
            <div className="flex items-center gap-4 mb-4">
              <Button
                variant="outline"
                onClick={() => navigate(`/medications/patient/${patientId}`)}
                className="flex items-center gap-2 hover:bg-gray-50"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Patient Medications
              </Button>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent mb-2">
              Prescribe Medication
            </h1>
            <p className="text-gray-600">Add a new medication prescription for the patient</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-6">
                <Pill className="w-5 h-5 text-teal-600" />
                <h2 className="text-xl font-semibold text-gray-800">Prescription Details</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="medicationId" className="text-sm font-medium text-gray-700 mb-2 block">
                    Medication *
                  </Label>
                  <select
                    id="medicationId"
                    name="medicationId"
                    value={formData.medicationId}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  >
                    <option value="">Select Medication</option>
                    {medications.map((medication) => (
                      <option key={medication.id} value={medication.id}>
                        {medication.genericName} {medication.brandName && `(${medication.brandName})`} - {medication.strength}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="providerId" className="text-sm font-medium text-gray-700 mb-2 block">
                    Prescribing Provider *
                  </Label>
                  <select
                    id="providerId"
                    name="providerId"
                    value={formData.providerId}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  >
                    <option value="">Select Provider</option>
                    {providers.map((provider) => (
                      <option key={provider.id} value={provider.id}>
                        Dr. {provider.firstName} {provider.lastName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="dosage" className="text-sm font-medium text-gray-700 mb-2 block">
                    Dosage *
                  </Label>
                  <Input
                    id="dosage"
                    name="dosage"
                    value={formData.dosage}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., 500mg, 1 tablet"
                    className="focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>

                <div>
                  <Label htmlFor="frequency" className="text-sm font-medium text-gray-700 mb-2 block">
                    Frequency *
                  </Label>
                  <Input
                    id="frequency"
                    name="frequency"
                    value={formData.frequency}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., Twice daily, Every 8 hours"
                    className="focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>

                <div>
                  <Label htmlFor="route" className="text-sm font-medium text-gray-700 mb-2 block">
                    Route *
                  </Label>
                  <select
                    id="route"
                    name="route"
                    value={formData.route}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  >
                    <option value="oral">Oral</option>
                    <option value="topical">Topical</option>
                    <option value="injection">Injection</option>
                    <option value="inhalation">Inhalation</option>
                    <option value="sublingual">Sublingual</option>
                    <option value="rectal">Rectal</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="startDate" className="text-sm font-medium text-gray-700 mb-2 block">
                    Start Date *
                  </Label>
                  <Input
                    id="startDate"
                    name="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    required
                    className="focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>

                <div>
                  <Label htmlFor="endDate" className="text-sm font-medium text-gray-700 mb-2 block">
                    End Date (Optional)
                  </Label>
                  <Input
                    id="endDate"
                    name="endDate"
                    type="date"
                    value={formData.endDate || ""}
                    onChange={handleInputChange}
                    className="focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>

                <div>
                  <Label htmlFor="status" className="text-sm font-medium text-gray-700 mb-2 block">
                    Status
                  </Label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  >
                    <option value="active">Active</option>
                    <option value="paused">Paused</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div>
                  <Label htmlFor="reason" className="text-sm font-medium text-gray-700 mb-2 block">
                    Reason for Prescription
                  </Label>
                  <Input
                    id="reason"
                    name="reason"
                    value={formData.reason}
                    onChange={handleInputChange}
                    placeholder="e.g., Pain management, Infection treatment"
                    className="focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>

                <div>
                  <Label htmlFor="instructions" className="text-sm font-medium text-gray-700 mb-2 block">
                    Instructions
                  </Label>
                  <textarea
                    id="instructions"
                    name="instructions"
                    value={formData.instructions}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Special instructions for the patient"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(`/medications/patient/${patientId}`)}
                className="px-6 py-2"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-teal-600 hover:bg-teal-700 flex items-center gap-2"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {loading ? "Prescribing..." : "Prescribe Medication"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddPatientMedication;