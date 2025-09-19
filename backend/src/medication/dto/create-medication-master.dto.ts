import { IsNotEmpty, IsString, IsOptional, IsEnum, IsBoolean } from "class-validator";

export class CreateMedicationMasterDto {
  @IsNotEmpty()
  @IsString()
  genericName: string;

  @IsOptional()
  @IsString()
  brandName?: string;

  @IsNotEmpty()
  @IsEnum(["tablet", "capsule", "syrup", "injection", "inhaler", "cream", "drops", "patch"])
  dosageForm: string;

  @IsNotEmpty()
  @IsString()
  strength: string;

  @IsOptional()
  @IsString()
  manufacturer?: string;

  @IsNotEmpty()
  @IsEnum(["antibiotic", "analgesic", "antihypertensive", "antidiabetic", "antihistamine", "other"])
  classification: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}