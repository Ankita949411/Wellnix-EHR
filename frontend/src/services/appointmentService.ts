import { apiService } from "./api";
import { Appointment, CreateAppointmentData } from "../types/appointment";

export const appointmentService = {
  async getAppointments(page: number = 1, limit: number = 10, search?: string) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    if (search) {
      params.append("search", search);
    }

    const response = await apiService.get(`/appointments?${params}`) as any;
    return response;
  },

  async getAppointment(id: string) {
    const response = await apiService.get(`/appointments/${id}`) as any;
    return response;
  },

  async createAppointment(data: CreateAppointmentData) {
    const response = await apiService.post("/appointments", data) as any;
    return response;
  },

  async updateAppointment(id: string, data: Partial<CreateAppointmentData>) {
    const response = await apiService.patch(`/appointments/${id}`, data) as any;
    return response;
  },

  async deleteAppointment(id: string) {
    const response = await apiService.delete(`/appointments/${id}`) as any;
    return response;
  },

  async checkInAppointment(id: string) {
    const response = await apiService.patch(`/appointments/${id}/check-in`) as any;
    return response;
  },
};