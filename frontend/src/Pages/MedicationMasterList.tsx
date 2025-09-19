import React, { useState, useEffect, useRef } from "react";
import { Search, Plus, Edit, Pill } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { medicationService } from "../services/medicationService";
import { MedicationMaster } from "../types/medication";
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
import Sidebar from "../components/layout/Sidebar";

const MedicationMasterList: React.FC = () => {
  const navigate = useNavigate();
  const [medications, setMedications] = useState<MedicationMaster[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const fetchMedications = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await medicationService.getMedicationMaster(page, 10, debouncedSearch);
      setMedications(response.data.medications);
      setTotalPages(response.data.totalPages);
      setTotal(response.data.total);
    } catch (error: any) {
      setError(error.message || "Failed to fetch medications");
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
    fetchMedications();
  }, [page, debouncedSearch]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    const validPage = Math.max(1, Math.min(newPage, totalPages));
    setPage(validPage);
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
            <p className="text-gray-600 font-medium">Loading medications...</p>
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
              <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent mb-2">
                Medication Master
              </h1>
              <p className="text-gray-600">
                Manage medication formulary and drug database
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
                  <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-400 w-5 h-5" />
                    <Input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Search medications..."
                      value={search}
                      onChange={handleSearch}
                      className="pl-12 w-full h-12 border-gray-200 focus:border-teal-400 focus:ring-teal-400 rounded-lg"
                    />
                  </div>
                  <Button 
                    onClick={() => navigate('/medications/master/add')}
                    className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 whitespace-nowrap"
                  >
                    <Plus className="w-4 h-4" />
                    Add Medication
                  </Button>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-teal-50 rounded-lg">
                  <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                  <span className="text-sm font-medium text-teal-700 whitespace-nowrap">
                    {total} Total Medications
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
                  <TableRow className="bg-gradient-to-r from-teal-50 via-cyan-50 to-blue-50 border-b border-teal-200">
                    <TableHead className="font-semibold text-gray-700 w-[200px]">Generic Name</TableHead>
                    <TableHead className="font-semibold text-gray-700 w-[150px]">Brand Name</TableHead>
                    <TableHead className="font-semibold text-gray-700 w-[100px]">Form</TableHead>
                    <TableHead className="font-semibold text-gray-700 w-[100px]">Strength</TableHead>
                    <TableHead className="font-semibold text-gray-700 w-[120px]">Classification</TableHead>
                    <TableHead className="font-semibold text-gray-700 w-[150px]">Manufacturer</TableHead>
                    <TableHead className="font-semibold text-gray-700 w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {medications.map((medication, index) => (
                    <TableRow
                      key={medication.id}
                      className={`hover:bg-teal-50/50 transition-colors ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                      }`}
                    >
                      <TableCell className="font-medium text-gray-900">
                        <button
                          onClick={() => navigate(`/medications/master/${medication.id}`)}
                          className="text-teal-600 hover:text-teal-800 hover:underline font-medium"
                        >
                          {medication.genericName}
                        </button>
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {medication.brandName || 'N/A'}
                      </TableCell>
                      <TableCell>
                        <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded capitalize">
                          {medication.dosageForm}
                        </span>
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {medication.strength}
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 text-xs font-bold rounded capitalize ${getClassificationBadge(medication.classification)}`}>
                          {medication.classification}
                        </span>
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {medication.manufacturer || 'N/A'}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/medications/master/edit/${medication.id}`)}
                            className="hover:bg-teal-50 hover:border-teal-400 transition-all group p-1"
                          >
                            <Edit className="w-4 h-4 text-teal-600 group-hover:scale-110 transition-transform" />
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
                  className="px-4 py-2 disabled:opacity-50 hover:bg-teal-50 hover:border-teal-300"
                >
                  Previous
                </Button>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Page</span>
                  <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-lg font-semibold">
                    {page}
                  </span>
                  <span className="text-sm text-gray-600">of {totalPages}</span>
                </div>
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                  className="px-4 py-2 disabled:opacity-50 hover:bg-teal-50 hover:border-teal-300"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MedicationMasterList;