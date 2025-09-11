import { UserRole } from "../user.enums";

export interface IUser {
  id: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  department?: string;
  licenseNumber?: string;
}
