export interface MedicationMaster {
  id: string;
  genericName: string;
  brandName?: string;
  dosageForm: "tablet" | "capsule" | "syrup" | "injection" | "inhaler" | "cream" | "drops" | "patch";
  strength: string;
  manufacturer?: string;
  classification: "antibiotic" | "analgesic" | "antihypertensive" | "antidiabetic" | "antihistamine" | "other";
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PatientMedication {
  id: string;
  patientId: number;
  medicationId: string;
  providerId: number;
  patient?: {
    id: number;
    patientId: string;
    firstName: string;
    lastName: string;
  };
  medication?: MedicationMaster;
  provider?: {
    id: number;
    firstName: string;
    lastName: string;
  };
  dosage: string;
  frequency: string;
  route: string;
  startDate: string;
  endDate?: string;
  status: "active" | "completed" | "discontinued" | "paused";
  reason?: string;
  instructions?: string;
  encounterId?: string;
  adverseReactions?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMedicationMasterData {
  genericName: string;
  brandName?: string;
  dosageForm: "tablet" | "capsule" | "syrup" | "injection" | "inhaler" | "cream" | "drops" | "patch";
  strength: string;
  manufacturer?: string;
  classification: "antibiotic" | "analgesic" | "antihypertensive" | "antidiabetic" | "antihistamine" | "other";
  description?: string;
  isActive?: boolean;
}

export interface CreatePatientMedicationData {
  patientId: number;
  medicationId: string;
  providerId: number;
  dosage: string;
  frequency: string;
  route: string;
  startDate: string;
  endDate?: string;
  status?: "active" | "completed" | "discontinued" | "paused";
  reason?: string;
  instructions?: string;
  encounterId?: string;
  adverseReactions?: string;
}