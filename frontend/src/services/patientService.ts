import { apiService } from "./api";
import {
  Patient,
  CreatePatientDto,
  PatientListResponse,
} from "../types/patient";
import { ApiResponse } from "../types/user";

export const patientService = {
  getPatients: (
    page: number = 1,
    limit: number = 10,
    search?: string
  ): Promise<ApiResponse<PatientListResponse>> => {
    const validPage = isNaN(page) ? 1 : Math.max(1, Math.floor(page));
    const validLimit = isNaN(limit) ? 10 : Math.max(1, Math.floor(limit));

    const params = new URLSearchParams({
      page: validPage.toString(),
      limit: validLimit.toString(),
      ...(search && search.trim() && { search: search.trim() }),
    });
    return apiService.get(`/patients/list?${params}`);
  },

  getPatientById: (id: number): Promise<ApiResponse<Patient>> => {
    return apiService.get(`/patients/${id}`);
  },

  createPatient: (
    patientData: CreatePatientDto
  ): Promise<ApiResponse<Patient>> => {
    return apiService.post("/patients", patientData);
  },

  updatePatient: (
    id: number,
    patientData: Partial<Patient>
  ): Promise<ApiResponse<Patient>> => {
    return apiService.request(`/patients/${id}`, {
      method: "PATCH",
      body: JSON.stringify(patientData),
    });
  },

  deletePatient: (id: number): Promise<ApiResponse<Patient>> => {
    return apiService.delete(`/patients/${id}`);
  },
};
