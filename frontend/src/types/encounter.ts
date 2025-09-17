export interface Encounter {
  id: string;
  encounterId: string;
  patient: {
    id: number;
    firstName: string;
    lastName: string;
    patientId: string;
  };
  provider: {
    id: number;
    firstName: string;
    lastName: string;
  };
  encounterType: 'consultation' | 'follow-up' | 'emergency' | 'routine';
  encounterDate: string;
  chiefComplaint: string;
  historyOfPresentIllness?: string;
  physicalExamination?: string;
  assessment?: string;
  plan?: string;
  notes?: string;
  status: 'active' | 'completed' | 'cancelled';
  duration?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEncounterDto {
  patientId: number;
  providerId: number;
  encounterType: string;
  encounterDate: string;
  chiefComplaint: string;
  historyOfPresentIllness?: string;
  physicalExamination?: string;
  assessment?: string;
  plan?: string;
  notes?: string;
  status?: string;
  duration?: number;
}

export interface EncounterListResponse {
  encounters: Encounter[];
  total: number;
  page: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}