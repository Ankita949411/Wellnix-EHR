import { MinLength, IsEmail, IsString, IsEnum, IsOptional } from "class-validator";
import { UserRole } from "../user.enums";

export class CreateUserDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  @IsEnum(UserRole)
  role: UserRole;

  @IsString()
  department: string;

  @IsOptional()
  @IsString()
  licenseNumber?: string;
}
