import { SetMetadata } from "@nestjs/common";
import { UserRole } from "./user.enums";

export const Roles = (...roles: UserRole[]) => SetMetadata("roles", roles);
