import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pill, Save, ArrowLeft } from "lucide-react";
import { medicationService } from "../services/medicationService";
import { CreateMedicationMasterData } from "../types/medication";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import Sidebar from "../components/layout/Sidebar";

const AddMedicationMaster: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateMedicationMasterData>({
    genericName: "",
    brandName: "",
    dosageForm: "tablet",
    strength: "",
    manufacturer: "",
    classification: "other",
    description: "",
    isActive: true,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.genericName || !formData.strength) {
      setError("Generic name and strength are required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await medicationService.createMedicationMaster(formData);
      navigate("/medications");
    } catch (error: any) {
      setError(error.message || "Failed to create medication");
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
                onClick={() => navigate("/medications")}
                className="flex items-center gap-2 hover:bg-gray-50"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Medications
              </Button>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent mb-2">
              Add New Medication
            </h1>
            <p className="text-gray-600">Add a new medication to the formulary</p>
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
                <h2 className="text-xl font-semibold text-gray-800">Medication Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="genericName" className="text-sm font-medium text-gray-700 mb-2 block">
                    Generic Name *
                  </Label>
                  <Input
                    id="genericName"
                    name="genericName"
                    value={formData.genericName}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., Acetaminophen"
                    className="focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>

                <div>
                  <Label htmlFor="brandName" className="text-sm font-medium text-gray-700 mb-2 block">
                    Brand Name
                  </Label>
                  <Input
                    id="brandName"
                    name="brandName"
                    value={formData.brandName}
                    onChange={handleInputChange}
                    placeholder="e.g., Tylenol"
                    className="focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>

                <div>
                  <Label htmlFor="dosageForm" className="text-sm font-medium text-gray-700 mb-2 block">
                    Dosage Form *
                  </Label>
                  <select
                    id="dosageForm"
                    name="dosageForm"
                    value={formData.dosageForm}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  >
                    <option value="tablet">Tablet</option>
                    <option value="capsule">Capsule</option>
                    <option value="syrup">Syrup</option>
                    <option value="injection">Injection</option>
                    <option value="inhaler">Inhaler</option>
                    <option value="cream">Cream</option>
                    <option value="drops">Drops</option>
                    <option value="patch">Patch</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="strength" className="text-sm font-medium text-gray-700 mb-2 block">
                    Strength *
                  </Label>
                  <Input
                    id="strength"
                    name="strength"
                    value={formData.strength}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., 500mg, 10ml"
                    className="focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>

                <div>
                  <Label htmlFor="classification" className="text-sm font-medium text-gray-700 mb-2 block">
                    Classification *
                  </Label>
                  <select
                    id="classification"
                    name="classification"
                    value={formData.classification}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  >
                    <option value="antibiotic">Antibiotic</option>
                    <option value="analgesic">Analgesic</option>
                    <option value="antihypertensive">Antihypertensive</option>
                    <option value="antidiabetic">Antidiabetic</option>
                    <option value="antihistamine">Antihistamine</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="manufacturer" className="text-sm font-medium text-gray-700 mb-2 block">
                    Manufacturer
                  </Label>
                  <Input
                    id="manufacturer"
                    name="manufacturer"
                    value={formData.manufacturer}
                    onChange={handleInputChange}
                    placeholder="e.g., Johnson & Johnson"
                    className="focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="mt-6">
                <Label htmlFor="description" className="text-sm font-medium text-gray-700 mb-2 block">
                  Description
                </Label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Additional information about the medication"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/medications")}
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
                {loading ? "Creating..." : "Create Medication"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddMedicationMaster;