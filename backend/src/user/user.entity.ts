// backend/src/user/user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { UserRole } from "./user.enums";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ type: "enum", enum: UserRole, default: UserRole.DOCTOR })
  role: UserRole;

  @Column({ nullable: true })
  department: string;

  @Column({ nullable: true })
  licenseNumber: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt: Date;

  @Column({ nullable: true })
  createdBy: string;
}
