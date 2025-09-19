export interface Appointment {
  id: string;
  appointmentId: string;
  patientId: number;
  providerId: number;
  patient?: {
    id: number;
    patientId: string;
    firstName: string;
    lastName: string;
  };
  provider?: {
    id: number;
    firstName: string;
    lastName: string;
  };
  appointmentDate: string;
  appointmentTime: string;
  duration: number;
  appointmentType: "consultation" | "follow-up" | "emergency" | "routine" | "checkup";
  reason: string;
  notes?: string;
  status: "scheduled" | "confirmed" | "checked-in" | "completed" | "cancelled" | "no-show";
  createdAt: string;
  updatedAt: string;
  encounterId?: string;
}

export interface CreateAppointmentData {
  patientId: number;
  providerId: number;
  appointmentDate: string;
  appointmentTime: string;
  duration?: number;
  appointmentType: "consultation" | "follow-up" | "emergency" | "routine" | "checkup";
  reason: string;
  notes?: string;
  status?: "scheduled" | "confirmed" | "checked-in" | "completed" | "cancelled" | "no-show";
}