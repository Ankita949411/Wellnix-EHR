export enum Gender {
  MALE = "male",
  FEMALE = "female",
  OTHER = "other"
}

export enum BloodType {
  A_POSITIVE = "A+",
  A_NEGATIVE = "A-",
  B_POSITIVE = "B+",
  B_NEGATIVE = "B-",
  AB_POSITIVE = "AB+",
  AB_NEGATIVE = "AB-",
  O_POSITIVE = "O+",
  O_NEGATIVE = "O-"
}

export interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: Gender;
  patientId: string;
  phone: string;
  email: string;
  address: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  bloodType?: BloodType;
  allergies?: string;
  medicalHistory?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePatientDto {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: Gender;
  phone: string;
  email: string;
  address: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  bloodType?: BloodType;
  allergies?: string;
  medicalHistory?: string;
}

export interface PatientListResponse {
  patients: Patient[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}