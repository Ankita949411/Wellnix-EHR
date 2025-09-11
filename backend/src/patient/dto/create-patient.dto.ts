import {
  IsString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsDateString,
} from "class-validator";
import { Gender, BloodType } from "../patient.enums";

export class CreatePatientDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsDateString()
  dateOfBirth: string;

  @IsEnum(Gender)
  gender: Gender;

  @IsString()
  phone: string;

  @IsEmail()
  email: string;

  @IsString()
  address: string;

  @IsOptional()
  @IsString()
  emergencyContact?: string;

  @IsOptional()
  @IsString()
  emergencyPhone?: string;

  @IsOptional()
  @IsEnum(BloodType)
  bloodType?: BloodType;

  @IsOptional()
  @IsString()
  allergies?: string;

  @IsOptional()
  @IsString()
  medicalHistory?: string;
}
