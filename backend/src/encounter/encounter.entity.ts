import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from "typeorm";
import { Patient } from "../patient/patient.entity";
import { User } from "../user/user.entity";

/**
 * Encounter Entity - Represents a medical encounter/visit between a patient and healthcare provider
 * Stores clinical information including chief complaint, examination findings, assessment, and treatment plan
 */
@Entity("encounters")
export class Encounter {
  // Primary key - UUID for unique identification
  @PrimaryGeneratedColumn("uuid")
  id: string;

  // Auto-generated encounter ID (e.g., ENC20241201001)
  @Column({ unique: true })
  encounterId: string;

  // Foreign key to Patient table
  @Column({ nullable: true })
  patientId: number;

  // Foreign key to User table (provider)
  @Column({ nullable: true })
  providerId: number;

  @Column({ nullable: true })
  appointmentId: string;

  // Relationship to Patient entity - who is being treated
  @ManyToOne(() => Patient)
  @JoinColumn({ name: "patientId" })
  patient: Patient;

  // Relationship to User entity - healthcare provider conducting the encounter
  @ManyToOne(() => User)
  @JoinColumn({ name: "providerId" })
  provider: User;

  // Type of encounter - consultation, follow-up, emergency, or routine
  @Column({
    type: "enum",
    enum: ["consultation", "follow-up", "emergency", "routine"],
  })
  encounterType: string;

  // Date when the encounter took place - indexed for efficient querying
  @Index()
  @Column()
  encounterDate: Date;

  // Primary reason for the patient's visit
  @Column()
  chiefComplaint: string;

  // Detailed history of the current medical condition
  @Column("text", { nullable: true })
  historyOfPresentIllness: string;

  // Physical examination findings and observations
  @Column("text", { nullable: true })
  physicalExamination: string;

  // Clinical assessment and diagnosis
  @Column("text", { nullable: true })
  assessment: string;

  // Treatment plan and recommendations
  @Column("text", { nullable: true })
  plan: string;

  // Additional notes and observations
  @Column("text", { nullable: true })
  notes: string;

  // Current status of the encounter
  @Column({
    type: "enum",
    enum: ["active", "completed", "cancelled"],
    default: "active",
  })
  status: string;

  // Duration of the encounter in minutes
  @Column({ type: "int", nullable: true })
  duration: number;

  // Timestamp when the record was created
  @CreateDateColumn()
  createdAt: Date;

  // Timestamp when the record was last updated
  @UpdateDateColumn()
  updatedAt: Date;
}
