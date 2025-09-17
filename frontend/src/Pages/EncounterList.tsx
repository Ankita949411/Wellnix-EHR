import React, { useState, useEffect, useRef } from "react";
import { Search, Trash2, Eye, Plus, Edit, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { encounterService } from "../services/encounterService";
import { Encounter } from "../types/encounter";
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

const EncounterList: React.FC = () => {
  const navigate = useNavigate();
  const [encounters, setEncounters] = useState<Encounter[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, encounter: null as Encounter | null });
  const [deleteLoading, setDeleteLoading] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const fetchEncounters = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await encounterService.getEncounters(page, 10, debouncedSearch);
      setEncounters(response.data.encounters);
      setTotalPages(response.data.totalPages);
      setTotal(response.data.total);
    } catch (error: any) {
      setError(error.message || "Failed to fetch encounters");
      console.error("Error fetching encounters:", error);
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
    fetchEncounters();
  }, [page, debouncedSearch]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    const validPage = Math.max(1, Math.min(newPage, totalPages));
    setPage(validPage);
  };

  const handleDeleteClick = (encounter: Encounter) => {
    setDeleteModal({ isOpen: true, encounter });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.encounter) return;
    
    setDeleteLoading(true);
    try {
      await encounterService.deleteEncounter(deleteModal.encounter.id);
      fetchEncounters();
      setDeleteModal({ isOpen: false, encounter: null });
    } catch (error: any) {
      setError(error.message || "Failed to delete encounter");
    } finally {
      setDeleteLoading(false);
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

  const getTypeBadge = (type: string) => {
    const colors = {
      consultation: "bg-purple-100 text-purple-800 border border-purple-200",
      "follow-up": "bg-blue-100 text-blue-800 border border-blue-200",
      emergency: "bg-red-100 text-red-800 border border-red-200",
      routine: "bg-green-100 text-green-800 border border-green-200",
    };
    return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800 border border-gray-200";
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <Sidebar />
        <div className="flex-1 flex justify-center items-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading encounters...</p>
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
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                Encounter Management
              </h1>
              <p className="text-gray-600">
                Manage patient encounters and medical visits
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
                  <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-5 h-5" />
                    <Input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Search encounters..."
                      value={search}
                      onChange={handleSearch}
                      className="pl-12 w-full h-12 border-gray-200 focus:border-purple-400 focus:ring-purple-400 rounded-lg"
                    />
                  </div>
                  <Button 
                    onClick={() => navigate('/encounters/add')}
                    className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 whitespace-nowrap"
                  >
                    <Plus className="w-4 h-4" />
                    New Encounter
                  </Button>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-purple-50 rounded-lg">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-sm font-medium text-purple-700 whitespace-nowrap">
                    {total} Total Encounters
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
                <TableRow className="bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 border-b border-purple-200">
                  <TableHead className="font-semibold text-gray-700 min-w-[120px]">Encounter ID</TableHead>
                  <TableHead className="font-semibold text-gray-700 min-w-[150px]">Patient</TableHead>
                  <TableHead className="font-semibold text-gray-700 min-w-[120px]">Provider</TableHead>
                  <TableHead className="font-semibold text-gray-700 min-w-[100px]">Type</TableHead>
                  <TableHead className="font-semibold text-gray-700 min-w-[100px]">Date</TableHead>
                  <TableHead className="font-semibold text-gray-700 min-w-[200px]">Chief Complaint</TableHead>
                  <TableHead className="font-semibold text-gray-700 min-w-[100px]">Status</TableHead>
                  <TableHead className="font-semibold text-gray-700 min-w-[140px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {encounters.map((encounter, index) => (
                  <TableRow
                    key={encounter.id}
                    className={`hover:bg-purple-50/50 transition-colors ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                    }`}
                  >
                    <TableCell className="font-bold text-purple-800 bg-purple-50 rounded-lg px-3 py-1 whitespace-nowrap">
                      {encounter.encounterId}
                    </TableCell>
                    <TableCell className="min-w-[150px]">
                      <div className="font-medium text-gray-900 truncate">
                        {encounter.patient?.firstName || 'N/A'} {encounter.patient?.lastName || ''}
                      </div>
                      <div className="text-sm text-gray-500 truncate">{encounter.patient?.patientId || 'N/A'}</div>
                    </TableCell>
                    <TableCell className="min-w-[120px]">
                      <div className="font-medium text-gray-900 truncate">
                        {encounter.provider?.firstName || 'N/A'} {encounter.provider?.lastName || ''}
                      </div>
                    </TableCell>
                    <TableCell className="min-w-[100px]">
                      <span className={`px-2 py-1 text-xs font-bold rounded-full whitespace-nowrap ${getTypeBadge(encounter.encounterType)}`}>
                        {encounter.encounterType.toUpperCase()}
                      </span>
                    </TableCell>
                    <TableCell className="text-gray-600 whitespace-nowrap">
                      {formatDate(encounter.encounterDate)}
                    </TableCell>
                    <TableCell className="text-gray-600 max-w-[200px] truncate">
                      {encounter.chiefComplaint}
                    </TableCell>
                    <TableCell className="min-w-[100px]">
                      <span className={`px-2 py-1 text-xs font-bold rounded-full whitespace-nowrap ${getStatusBadge(encounter.status)}`}>
                        {encounter.status.toUpperCase()}
                      </span>
                    </TableCell>
                    <TableCell className="min-w-[140px]">
                      <div className="flex space-x-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/encounters/${encounter.id}`)}
                          className="hover:bg-purple-50 hover:border-purple-400 hover:shadow-md transition-all duration-200 group p-2"
                        >
                          <Eye className="w-4 h-4 text-purple-600 group-hover:scale-110 transition-transform" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/encounters/edit/${encounter.id}`)}
                          className="hover:bg-blue-50 hover:border-blue-400 hover:shadow-md transition-all duration-200 group p-2"
                        >
                          <Edit className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteClick(encounter)}
                          className="hover:bg-red-50 hover:border-red-400 text-red-600 hover:text-red-700 hover:shadow-md transition-all duration-200 group p-2"
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
                  className="px-4 py-2 disabled:opacity-50 hover:bg-purple-50 hover:border-purple-300"
                >
                  Previous
                </Button>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Page</span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg font-semibold">
                    {page}
                  </span>
                  <span className="text-sm text-gray-600">of {totalPages}</span>
                </div>
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                  className="px-4 py-2 disabled:opacity-50 hover:bg-purple-50 hover:border-purple-300"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
        
        <DeleteModal
          isOpen={deleteModal.isOpen}
          onClose={() => setDeleteModal({ isOpen: false, encounter: null })}
          onConfirm={handleDeleteConfirm}
          title="Cancel Encounter"
          message={`Are you sure you want to cancel this encounter? This action cannot be undone.`}
          loading={deleteLoading}
        />
      </div>
    </div>
  );
};

export default EncounterList;