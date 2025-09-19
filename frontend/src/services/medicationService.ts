import { apiService } from "./api";
import { MedicationMaster, PatientMedication, CreateMedicationMasterData, CreatePatientMedicationData } from "../types/medication";

export const medicationService = {
  // Medication Master methods
  async getMedicationMaster(page: number = 1, limit: number = 10, search?: string) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    if (search) {
      params.append("search", search);
    }

    const response = await apiService.get(`/medications/master?${params}`) as any;
    return response;
  },

  async getMedicationMasterById(id: string) {
    const response = await apiService.get(`/medications/master/${id}`) as any;
    return response;
  },

  async createMedicationMaster(data: CreateMedicationMasterData) {
    const response = await apiService.post("/medications/master", data) as any;
    return response;
  },

  // Patient Medication methods
  async getPatientMedications(patientId: number, status?: string) {
    const params = new URLSearchParams();
    if (status) {
      params.append("status", status);
    }

    const response = await apiService.get(`/medications/patient/${patientId}?${params}`) as any;
    return response;
  },

  async createPatientMedication(data: CreatePatientMedicationData) {
    const response = await apiService.post("/medications/patient", data) as any;
    return response;
  },

  async updatePatientMedication(id: string, data: Partial<CreatePatientMedicationData>) {
    const response = await apiService.patch(`/medications/patient/${id}`, data) as any;
    return response;
  },

  async discontinuePatientMedication(id: string, reason?: string) {
    const response = await apiService.patch(`/medications/patient/${id}/discontinue`, { reason }) as any;
    return response;
  },
};