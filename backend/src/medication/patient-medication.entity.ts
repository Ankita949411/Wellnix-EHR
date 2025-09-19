import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Patient } from "../patient/patient.entity";
import { User } from "../user/user.entity";
import { MedicationMaster } from "./medication-master.entity";

@Entity("patient_medications")
export class PatientMedication {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  patientId: number;

  @Column()
  medicationId: string;

  @Column()
  providerId: number;

  @ManyToOne(() => Patient)
  @JoinColumn({ name: "patientId" })
  patient: Patient;

  @ManyToOne(() => MedicationMaster)
  @JoinColumn({ name: "medicationId" })
  medication: MedicationMaster;

  @ManyToOne(() => User)
  @JoinColumn({ name: "providerId" })
  provider: User;

  @Column()
  dosage: string;

  @Column()
  frequency: string;

  @Column()
  route: string;

  @Column()
  startDate: Date;

  @Column({ nullable: true })
  endDate: Date;

  @Column({
    type: "enum",
    enum: ["active", "completed", "discontinued", "paused"],
    default: "active",
  })
  status: string;

  @Column("text", { nullable: true })
  reason: string;

  @Column("text", { nullable: true })
  instructions: string;

  @Column({ nullable: true })
  encounterId: string;

  @Column("text", { nullable: true })
  adverseReactions: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}