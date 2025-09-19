import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar, Clock, User as UserIcon, FileText, Save, ArrowLeft } from "lucide-react";
import { appointmentService } from "../services/appointmentService";
import { patientService } from "../services/patientService";
import { userService } from "../services/userService";
import { Appointment, CreateAppointmentData } from "../types/appointment";
import { Patient } from "../types/patient";
import { User, UserRole } from "../types/user";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import Sidebar from "../components/layout/Sidebar";

const EditAppointment: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [providers, setProviders] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateAppointmentData>({
    patientId: 0,
    providerId: 0,
    appointmentDate: "",
    appointmentTime: "",
    duration: 30,
    appointmentType: "consultation",
    reason: "",
    notes: "",
    status: "scheduled",
  });

  useEffect(() => {
    if (id) {
      fetchAppointmentAndData();
    }
  }, [id]);

  const fetchAppointmentAndData = async () => {
    try {
      setFetchLoading(true);
      const [appointmentResponse, patientsResponse, providersResponse] = await Promise.all([
        appointmentService.getAppointment(id!),
        patientService.getPatients(1, 100),
        userService.getUsers(1, 100),
      ]);

      const appointment: Appointment = appointmentResponse.data;
      setPatients(patientsResponse.data.patients);
      setProviders(providersResponse.data.users.filter((user: User) => user.role === UserRole.DOCTOR));

      setFormData({
        patientId: appointment.patientId,
        providerId: appointment.providerId,
        appointmentDate: appointment.appointmentDate.split('T')[0],
        appointmentTime: appointment.appointmentTime,
        duration: appointment.duration,
        appointmentType: appointment.appointmentType,
        reason: appointment.reason,
        notes: appointment.notes || "",
        status: appointment.status,
      });
    } catch (error: any) {
      setError("Failed to load appointment data");
    } finally {
      setFetchLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "patientId" || name === "providerId" || name === "duration" 
        ? parseInt(value) || 0 
        : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.patientId || !formData.providerId) {
      setError("Please select both patient and provider");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await appointmentService.updateAppointment(id!, formData);
      navigate(`/appointments/${id}`);
    } catch (error: any) {
      setError(error.message || "Failed to update appointment");
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
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

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Sidebar />
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
            <div className="flex items-center gap-4 mb-4">
              <Button
                variant="outline"
                onClick={() => navigate(`/appointments/${id}`)}
                className="flex items-center gap-2 hover:bg-gray-50"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Appointment
              </Button>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
              Edit Appointment
            </h1>
            <p className="text-gray-600">Update appointment information</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-6">
                <UserIcon className="w-5 h-5 text-orange-600" />
                <h2 className="text-xl font-semibold text-gray-800">Patient & Provider Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="patientId" className="text-sm font-medium text-gray-700 mb-2 block">
                    Patient *
                  </Label>
                  <select
                    id="patientId"
                    name="patientId"
                    value={formData.patientId}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="">Select Patient</option>
                    {patients.map((patient) => (
                      <option key={patient.id} value={patient.id}>
                        {patient.firstName} {patient.lastName} ({patient.patientId})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="providerId" className="text-sm font-medium text-gray-700 mb-2 block">
                    Provider *
                  </Label>
                  <select
                    id="providerId"
                    name="providerId"
                    value={formData.providerId}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="">Select Provider</option>
                    {providers.map((provider) => (
                      <option key={provider.id} value={provider.id}>
                        Dr. {provider.firstName} {provider.lastName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-6">
                <Calendar className="w-5 h-5 text-orange-600" />
                <h2 className="text-xl font-semibold text-gray-800">Appointment Details</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label htmlFor="appointmentDate" className="text-sm font-medium text-gray-700 mb-2 block">
                    Date *
                  </Label>
                  <Input
                    id="appointmentDate"
                    name="appointmentDate"
                    type="date"
                    value={formData.appointmentDate}
                    onChange={handleInputChange}
                    required
                    className="focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>

                <div>
                  <Label htmlFor="appointmentTime" className="text-sm font-medium text-gray-700 mb-2 block">
                    Time *
                  </Label>
                  <Input
                    id="appointmentTime"
                    name="appointmentTime"
                    type="time"
                    value={formData.appointmentTime}
                    onChange={handleInputChange}
                    required
                    className="focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>

                <div>
                  <Label htmlFor="duration" className="text-sm font-medium text-gray-700 mb-2 block">
                    Duration (minutes)
                  </Label>
                  <Input
                    id="duration"
                    name="duration"
                    type="number"
                    value={formData.duration}
                    onChange={handleInputChange}
                    min="15"
                    max="240"
                    className="focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <Label htmlFor="appointmentType" className="text-sm font-medium text-gray-700 mb-2 block">
                    Appointment Type *
                  </Label>
                  <select
                    id="appointmentType"
                    name="appointmentType"
                    value={formData.appointmentType}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="consultation">Consultation</option>
                    <option value="follow-up">Follow-up</option>
                    <option value="emergency">Emergency</option>
                    <option value="routine">Routine</option>
                    <option value="checkup">Checkup</option>
                  </select>
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="scheduled">Scheduled</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="checked-in">Checked In</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="no-show">No Show</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-6">
                <FileText className="w-5 h-5 text-orange-600" />
                <h2 className="text-xl font-semibold text-gray-800">Additional Information</h2>
              </div>
              
              <div className="space-y-6">
                <div>
                  <Label htmlFor="reason" className="text-sm font-medium text-gray-700 mb-2 block">
                    Reason for Visit *
                  </Label>
                  <Input
                    id="reason"
                    name="reason"
                    value={formData.reason}
                    onChange={handleInputChange}
                    required
                    placeholder="Brief description of the reason for the appointment"
                    className="focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>

                <div>
                  <Label htmlFor="notes" className="text-sm font-medium text-gray-700 mb-2 block">
                    Notes
                  </Label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Additional notes or special instructions"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(`/appointments/${id}`)}
                className="px-6 py-2"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-orange-600 hover:bg-orange-700 flex items-center gap-2"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {loading ? "Updating..." : "Update Appointment"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditAppointment;