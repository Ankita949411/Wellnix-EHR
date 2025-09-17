import { IsNotEmpty, IsString, IsNumber, IsOptional, IsDateString } from 'class-validator';

/**
 * CreateEncounterDto - Data Transfer Object for creating new encounters
 * Validates input data using class-validator decorators
 */
export class CreateEncounterDto {
  // Patient ID - required, must be a valid number
  @IsNotEmpty()
  @IsNumber()
  patientId: number;

  // Healthcare provider ID - required, must be a valid number
  @IsNotEmpty()
  @IsNumber()
  providerId: number;

  // Type of encounter - required, must be valid string
  @IsNotEmpty()
  @IsString()
  encounterType: string;

  // Date of encounter - required, must be valid date string
  @IsNotEmpty()
  @IsDateString()
  encounterDate: string;

  // Primary reason for visit - required
  @IsNotEmpty()
  @IsString()
  chiefComplaint: string;

  // Detailed history of current condition - optional
  @IsOptional()
  @IsString()
  historyOfPresentIllness?: string;

  // Physical examination findings - optional
  @IsOptional()
  @IsString()
  physicalExamination?: string;

  // Clinical assessment and diagnosis - optional
  @IsOptional()
  @IsString()
  assessment?: string;

  // Treatment plan and recommendations - optional
  @IsOptional()
  @IsString()
  plan?: string;

  // Additional notes and observations - optional
  @IsOptional()
  @IsString()
  notes?: string;

  // Encounter status - optional, defaults to 'active'
  @IsOptional()
  @IsString()
  status?: string;

  // Duration in minutes - optional
  @IsOptional()
  @IsNumber()
  duration?: number;
}