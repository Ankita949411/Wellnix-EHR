import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar, Clock, User, FileText, ArrowLeft, Edit, Trash2 } from "lucide-react";
import { appointmentService } from "../services/appointmentService";
import { Appointment } from "../types/appointment";
import { Button } from "../components/ui/button";
import DeleteModal from "../components/ui/DeleteModal";
import Sidebar from "../components/layout/Sidebar";

const ViewAppointment: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchAppointment();
    }
  }, [id]);

  const fetchAppointment = async () => {
    try {
      setLoading(true);
      const response = await appointmentService.getAppointment(id!);
      setAppointment(response.data);
    } catch (error: any) {
      setError(error.message || "Failed to fetch appointment");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await appointmentService.deleteAppointment(id!);
      navigate("/appointments");
    } catch (error: any) {
      setError(error.message || "Failed to delete appointment");
    } finally {
      setDeleteLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      scheduled: "bg-blue-100 text-blue-800 border border-blue-200",
      confirmed: "bg-green-100 text-green-800 border border-green-200",
      "checked-in": "bg-yellow-100 text-yellow-800 border border-yellow-200",
      completed: "bg-gray-100 text-gray-800 border border-gray-200",
      cancelled: "bg-red-100 text-red-800 border border-red-200",
      "no-show": "bg-red-100 text-red-800 border border-red-200",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800 border border-gray-200";
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <Sidebar />
        <div className="flex-1 flex justify-center items-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading appointment...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !appointment) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <Sidebar />
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <p className="text-red-700">{error || "Appointment not found"}</p>
              <Button
                onClick={() => navigate("/appointments")}
                className="mt-4"
                variant="outline"
              >
                Back to Appointments
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
                  onClick={() => navigate("/appointments")}
                  className="flex items-center gap-2 hover:bg-gray-50"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Appointments
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => navigate(`/appointments/edit/${appointment.id}`)}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </Button>
                <Button
                  onClick={() => setDeleteModal(true)}
                  variant="outline"
                  className="flex items-center gap-2 text-red-600 hover:bg-red-50 hover:border-red-300"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </Button>
              </div>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
              Appointment Details
            </h1>
            <p className="text-gray-600">View appointment information</p>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-6">
                <Calendar className="w-5 h-5 text-orange-600" />
                <h2 className="text-xl font-semibold text-gray-800">Appointment Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-500">Appointment ID</label>
                  <p className="text-lg font-semibold text-orange-800 bg-orange-50 rounded-lg px-3 py-2 mt-1">
                    {appointment.appointmentId}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <div className="mt-1">
                    <span className={`px-3 py-1 text-sm font-bold rounded-full ${getStatusBadge(appointment.status)}`}>
                      {appointment.status.toUpperCase()}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Date</label>
                  <p className="text-lg text-gray-900 mt-1">{formatDate(appointment.appointmentDate)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Time</label>
                  <p className="text-lg text-gray-900 mt-1">{appointment.appointmentTime}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Duration</label>
                  <p className="text-lg text-gray-900 mt-1">{appointment.duration} minutes</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Type</label>
                  <p className="text-lg text-gray-900 mt-1 capitalize">{appointment.appointmentType}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-6">
                <User className="w-5 h-5 text-orange-600" />
                <h2 className="text-xl font-semibold text-gray-800">Patient & Provider</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-500">Patient</label>
                  <div className="mt-1">
                    <p className="text-lg font-medium text-gray-900">
                      {appointment.patient?.firstName} {appointment.patient?.lastName}
                    </p>
                    <p className="text-sm text-gray-500">{appointment.patient?.patientId}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Provider</label>
                  <div className="mt-1">
                    <p className="text-lg font-medium text-gray-900">
                      Dr. {appointment.provider?.firstName} {appointment.provider?.lastName}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-6">
                <FileText className="w-5 h-5 text-orange-600" />
                <h2 className="text-xl font-semibold text-gray-800">Details</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Reason for Visit</label>
                  <p className="text-gray-900 mt-1">{appointment.reason}</p>
                </div>
                {appointment.notes && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Notes</label>
                    <p className="text-gray-900 mt-1">{appointment.notes}</p>
                  </div>
                )}
                {appointment.encounterId && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Linked Encounter</label>
                    <p className="text-gray-900 mt-1">{appointment.encounterId}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <DeleteModal
            isOpen={deleteModal}
            onClose={() => setDeleteModal(false)}
            onConfirm={handleDelete}
            title="Delete Appointment"
            message="Are you sure you want to delete this appointment? This action cannot be undone."
            loading={deleteLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default ViewAppointment;