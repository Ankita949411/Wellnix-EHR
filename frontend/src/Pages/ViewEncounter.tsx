import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit, Calendar, User, Stethoscope, Clock } from "lucide-react";
import { encounterService } from "../services/encounterService";
import { Encounter } from "../types/encounter";
import { Button } from "../components/ui/button";
import Sidebar from "../components/layout/Sidebar";

const ViewEncounter: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [encounter, setEncounter] = useState<Encounter | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchEncounter();
    }
  }, [id]);

  const fetchEncounter = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await encounterService.getEncounterById(id!);
      setEncounter(response.data);
    } catch (error: any) {
      setError(error.message || "Failed to fetch encounter");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      active: "bg-blue-100 text-blue-800 border border-blue-200",
      completed: "bg-green-100 text-green-800 border border-green-200",
      cancelled: "bg-red-100 text-red-800 border border-red-200",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800 border border-gray-200";
  };

  if (loading) {
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

  if (error || !encounter) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <Sidebar />
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <p className="text-red-700">{error || "Encounter not found"}</p>
              <Button
                onClick={() => navigate("/encounters")}
                className="mt-4"
              >
                Back to Encounters
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
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
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
                    Encounter Details
                  </h1>
                  <p className="text-gray-600 mt-1">Encounter ID: {encounter.encounterId}</p>
                </div>
              </div>
              <Button
                onClick={() => navigate(`/encounters/edit/${encounter.id}`)}
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
              >
                <Edit className="w-4 h-4" />
                Edit Encounter
              </Button>
            </div>

            <div className="space-y-8">
              {/* Basic Information */}
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-6 border border-purple-200">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  <h2 className="text-xl font-semibold text-purple-800">Basic Information</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Patient</label>
                    <p className="text-gray-900 font-medium">
                      {encounter.patient?.firstName} {encounter.patient?.lastName}
                    </p>
                    <p className="text-sm text-gray-500">{encounter.patient?.patientId}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Provider</label>
                    <p className="text-gray-900 font-medium">
                      {encounter.provider?.firstName} {encounter.provider?.lastName}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Encounter Type</label>
                    <span className="px-3 py-1 text-sm font-medium rounded-full bg-purple-100 text-purple-800 border border-purple-200">
                      {encounter.encounterType.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <p className="text-gray-900">{formatDate(encounter.encounterDate)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusBadge(encounter.status)}`}>
                      {encounter.status.toUpperCase()}
                    </span>
                  </div>
                  {encounter.duration && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <p className="text-gray-900">{encounter.duration} minutes</p>
                      </div>
                    </div>
                  )}
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Chief Complaint</label>
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <p className="text-gray-900">{encounter.chiefComplaint}</p>
                    </div>
                  </div>
                  {encounter.historyOfPresentIllness && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">History of Present Illness</label>
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <p className="text-gray-900 whitespace-pre-wrap">{encounter.historyOfPresentIllness}</p>
                      </div>
                    </div>
                  )}
                  {encounter.physicalExamination && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Physical Examination</label>
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <p className="text-gray-900 whitespace-pre-wrap">{encounter.physicalExamination}</p>
                      </div>
                    </div>
                  )}
                  {encounter.assessment && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Assessment</label>
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <p className="text-gray-900 whitespace-pre-wrap">{encounter.assessment}</p>
                      </div>
                    </div>
                  )}
                  {encounter.plan && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Plan</label>
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <p className="text-gray-900 whitespace-pre-wrap">{encounter.plan}</p>
                      </div>
                    </div>
                  )}
                  {encounter.notes && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <p className="text-gray-900 whitespace-pre-wrap">{encounter.notes}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Timestamps */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Created:</span> {formatDate(encounter.createdAt)}
                  </div>
                  <div>
                    <span className="font-medium">Last Updated:</span> {formatDate(encounter.updatedAt)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewEncounter;