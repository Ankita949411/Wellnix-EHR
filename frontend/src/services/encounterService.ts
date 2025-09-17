import { apiService } from "./api";
import {
  ApiResponse,
  EncounterListResponse,
  Encounter,
  CreateEncounterDto,
} from "../types/encounter";

export const encounterService = {
  getEncounters: (
    page: number = 1,
    limit: number = 10,
    search?: string
  ): Promise<ApiResponse<EncounterListResponse>> => {
    const validPage = isNaN(page) ? 1 : Math.max(1, Math.floor(page));
    const validLimit = isNaN(limit) ? 10 : Math.max(1, Math.floor(limit));

    const params = new URLSearchParams({
      page: validPage.toString(),
      limit: validLimit.toString(),
      ...(search && search.trim() && { search: search.trim() }),
    });
    return apiService.get(`/encounters?${params.toString()}`);
  },

  getEncounterById: (id: string): Promise<ApiResponse<Encounter>> => {
    return apiService.get(`/encounters/${id}`);
  },

  createEncounter: (encounterData: CreateEncounterDto): Promise<ApiResponse<Encounter>> => {
    return apiService.post("/encounters", encounterData);
  },

  updateEncounter: (
    id: string,
    encounterData: Partial<Encounter>
  ): Promise<ApiResponse<Encounter>> => {
    return apiService.request(`/encounters/${id}`, {
      method: "PATCH",
      body: JSON.stringify(encounterData),
    });
  },

  deleteEncounter: (id: string): Promise<ApiResponse<Encounter>> => {
    return apiService.delete(`/encounters/${id}`);
  },
};