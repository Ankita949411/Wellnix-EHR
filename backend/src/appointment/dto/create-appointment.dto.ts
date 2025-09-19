import { IsNotEmpty, IsString, IsDateString, IsOptional, IsEnum, IsNumber } from "class-validator";

export class CreateAppointmentDto {
  @IsNotEmpty()
  @IsNumber()
  patientId: number;

  @IsNotEmpty()
  @IsNumber()
  providerId: number;

  @IsNotEmpty()
  @IsDateString()
  appointmentDate: string;

  @IsNotEmpty()
  @IsString()
  appointmentTime: string;

  @IsOptional()
  @IsNumber()
  duration?: number;

  @IsNotEmpty()
  @IsEnum(["consultation", "follow-up", "emergency", "routine", "checkup"])
  appointmentType: string;

  @IsNotEmpty()
  @IsString()
  reason: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsEnum(["scheduled", "confirmed", "checked-in", "completed", "cancelled", "no-show"])
  status?: string;
}