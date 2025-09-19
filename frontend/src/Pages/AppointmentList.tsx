import React, { useState, useEffect, useRef } from "react";
import { Search, Trash2, Eye, Plus, Edit, Calendar, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { appointmentService } from "../services/appointmentService";
import { Appointment } from "../types/appointment";
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


const AppointmentList: React.FC = () => {
  // Custom tooltip styles
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .custom-tooltip {
        position: relative;
      }
      .custom-tooltip::after {
        content: attr(data-tooltip);
        position: absolute;
        bottom: 100%;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 6px 8px;
        border-radius: 4px;
        font-size: 12px;
        white-space: nowrap;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.2s, visibility 0.2s;
        z-index: 1000;
        pointer-events: none;
      }
      .custom-tooltip:hover::after {
        opacity: 1;
        visibility: visible;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, appointment: null as Appointment | null });
  const [deleteLoading, setDeleteLoading] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await appointmentService.getAppointments(page, 10, debouncedSearch);
      setAppointments(response.data.appointments);
      setTotalPages(response.data.totalPages);
      setTotal(response.data.total);
    } catch (error: any) {
      setError(error.message || "Failed to fetch appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    fetchAppointments();
  }, [page, debouncedSearch]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    const validPage = Math.max(1, Math.min(newPage, totalPages));
    setPage(validPage);
  };

  const handleDeleteClick = (appointment: Appointment) => {
    setDeleteModal({ isOpen: true, appointment });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.appointment) return;
    
    setDeleteLoading(true);
    try {
      await appointmentService.deleteAppointment(deleteModal.appointment.id);
      fetchAppointments();
      setDeleteModal({ isOpen: false, appointment: null });
    } catch (error: any) {
      setError(error.message || "Failed to delete appointment");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleCheckIn = async (appointment: Appointment) => {
    try {
      await appointmentService.checkInAppointment(appointment.id);
      fetchAppointments();
    } catch (error: any) {
      setError(error.message || "Failed to check in patient");
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

  const getTypeBadge = (type: string) => {
    const colors = {
      consultation: "bg-purple-100 text-purple-800 border border-purple-200",
      "follow-up": "bg-blue-100 text-blue-800 border border-blue-200",
      emergency: "bg-red-100 text-red-800 border border-red-200",
      routine: "bg-green-100 text-green-800 border border-green-200",
      checkup: "bg-indigo-100 text-indigo-800 border border-indigo-200",
    };
    return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800 border border-gray-200";
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <Sidebar />
        <div className="flex-1 flex justify-center items-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading appointments...</p>
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
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
                Appointment Management
              </h1>
              <p className="text-gray-600">
                Schedule and manage patient appointments
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
                  <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-400 w-5 h-5" />
                    <Input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Search appointments..."
                      value={search}
                      onChange={handleSearch}
                      className="pl-12 w-full h-12 border-gray-200 focus:border-orange-400 focus:ring-orange-400 rounded-lg"
                    />
                  </div>
                  <Button 
                    onClick={() => navigate('/appointments/add')}
                    className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 whitespace-nowrap"
                  >
                    <Plus className="w-4 h-4" />
                    New Appointment
                  </Button>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 rounded-lg">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-sm font-medium text-orange-700 whitespace-nowrap">
                    {total} Total Appointments
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
                  <TableRow className="bg-gradient-to-r from-orange-50 via-red-50 to-pink-50 border-b border-orange-200">
                    <TableHead className="font-semibold text-gray-700 w-[80px]">ID</TableHead>
                    <TableHead className="font-semibold text-gray-700 w-[120px]">Patient</TableHead>
                    <TableHead className="font-semibold text-gray-700 w-[80px]">Provider</TableHead>
                    <TableHead className="font-semibold text-gray-700 w-[70px]">Date</TableHead>
                    <TableHead className="font-semibold text-gray-700 w-[60px]">Time</TableHead>
                    <TableHead className="font-semibold text-gray-700 w-[90px]">Type</TableHead>
                    <TableHead className="font-semibold text-gray-700 w-[120px]">Reason</TableHead>
                    <TableHead className="font-semibold text-gray-700 w-[90px]">Status</TableHead>
                    <TableHead className="font-semibold text-gray-700 w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {appointments.map((appointment, index) => (
                    <TableRow
                      key={appointment.id}
                      className={`hover:bg-orange-50/50 transition-colors ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                      }`}
                    >
                      <TableCell className="font-bold text-orange-800 text-xs truncate">
                        {appointment.appointmentId.replace('APT', '')}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-gray-900 text-sm truncate">
                          {appointment.patient?.firstName || 'N/A'} {appointment.patient?.lastName || ''}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-gray-900 text-sm truncate">
                          {appointment.provider?.firstName || 'N/A'} {appointment.provider?.lastName || ''}
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-600 text-sm">
                        {new Date(appointment.appointmentDate).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' })}
                      </TableCell>
                      <TableCell className="text-gray-600 text-sm">
                        {appointment.appointmentTime.slice(0, 5)}
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 text-xs font-bold rounded ${getTypeBadge(appointment.appointmentType)}`}>
                          {appointment.appointmentType === 'follow-up' ? 'Follow-up' : 
                           appointment.appointmentType.charAt(0).toUpperCase() + appointment.appointmentType.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell className="text-gray-600 text-sm truncate">
                        {appointment.reason}
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 text-xs font-bold rounded ${getStatusBadge(appointment.status)}`}>
                          {appointment.status === 'checked-in' ? 'Checked In' :
                           appointment.status === 'no-show' ? 'No Show' :
                           appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/appointments/${appointment.id}`)}
                            className="hover:bg-orange-50 hover:border-orange-400 transition-all group p-1"
                          >
                            <Eye className="w-4 h-4 text-orange-600 group-hover:scale-110 transition-transform" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/appointments/edit/${appointment.id}`)}
                            className="hover:bg-blue-50 hover:border-blue-400 transition-all group p-1"
                          >
                            <Edit className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
                          </Button>
                          {appointment.status === "confirmed" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCheckIn(appointment)}
                              className="hover:bg-green-50 hover:border-green-400 transition-all group p-1"
                            >
                              <Clock className="w-4 h-4 text-green-600 group-hover:scale-110 transition-transform" />
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteClick(appointment)}
                            className="hover:bg-red-50 hover:border-red-400 text-red-600 hover:text-red-700 transition-all group p-1"
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
          </div>

          {totalPages > 1 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mt-4">
              <div className="flex justify-center items-center space-x-4">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="px-4 py-2 disabled:opacity-50 hover:bg-orange-50 hover:border-orange-300"
                >
                  Previous
                </Button>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Page</span>
                  <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-lg font-semibold">
                    {page}
                  </span>
                  <span className="text-sm text-gray-600">of {totalPages}</span>
                </div>
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                  className="px-4 py-2 disabled:opacity-50 hover:bg-orange-50 hover:border-orange-300"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
        
        <DeleteModal
          isOpen={deleteModal.isOpen}
          onClose={() => setDeleteModal({ isOpen: false, appointment: null })}
          onConfirm={handleDeleteConfirm}
          title="Cancel Appointment"
          message="Are you sure you want to cancel this appointment? This action cannot be undone."
          loading={deleteLoading}
        />
      </div>
    </div>
  );
};

export default AppointmentList;