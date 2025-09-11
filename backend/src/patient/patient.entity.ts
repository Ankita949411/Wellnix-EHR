import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { Gender, BloodType } from "../patient/patient.enums";

@Entity()
export class Patient {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ type: "date" })
  dateOfBirth: Date;

  @Column({ type: "enum", enum: Gender })
  gender: Gender;

  @Column({ unique: true })
  patientId: string;

  @Column()
  phone: string;

  @Column()
  email: string;

  @Column()
  address: string;

  @Column({ nullable: true })
  emergencyContact: string;

  @Column({ nullable: true })
  emergencyPhone: string;

  @Column({ type: "enum", enum: BloodType, nullable: true })
  bloodType: BloodType;

  @Column({ nullable: true })
  allergies: string;

  @Column({ nullable: true })
  medicalHistory: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt: Date;
}
