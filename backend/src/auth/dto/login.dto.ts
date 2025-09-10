import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";
import { UserRole } from "../../user/user.enums";

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}

export class RegisterDto {
  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  @IsNotEmpty()
  role: UserRole;
}
