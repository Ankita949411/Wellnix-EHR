import { IsNotEmpty, IsString, IsOptional, IsEnum, IsNumber, IsDateString } from "class-validator";

export class CreatePatientMedicationDto {
  @IsNotEmpty()
  @IsNumber()
  patientId: number;

  @IsNotEmpty()
  @IsString()
  medicationId: string;

  @IsNotEmpty()
  @IsNumber()
  providerId: number;

  @IsNotEmpty()
  @IsString()
  dosage: string;

  @IsNotEmpty()
  @IsString()
  frequency: string;

  @IsNotEmpty()
  @IsString()
  route: string;

  @IsNotEmpty()
  @IsDateString()
  startDate: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsEnum(["active", "completed", "discontinued", "paused"])
  status?: string;

  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  @IsString()
  instructions?: string;

  @IsOptional()
  @IsString()
  encounterId?: string;

  @IsOptional()
  @IsString()
  adverseReactions?: string;
}