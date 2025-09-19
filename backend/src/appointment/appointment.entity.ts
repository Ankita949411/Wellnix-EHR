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

@Entity("appointments")
export class Appointment {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  appointmentId: string;

  @Column({ nullable: true })
  patientId: number;

  @Column({ nullable: true })
  providerId: number;

  @ManyToOne(() => Patient)
  @JoinColumn({ name: "patientId" })
  patient: Patient;

  @ManyToOne(() => User)
  @JoinColumn({ name: "providerId" })
  provider: User;

  @Index()
  @Column()
  appointmentDate: Date;

  @Column()
  appointmentTime: string;

  @Column({ type: "int", default: 30 })
  duration: number;

  @Column({
    type: "enum",
    enum: ["consultation", "follow-up", "emergency", "routine", "checkup"],
  })
  appointmentType: string;

  @Column()
  reason: string;

  @Column("text", { nullable: true })
  notes: string;

  @Column({
    type: "enum",
    enum: ["scheduled", "confirmed", "checked-in", "completed", "cancelled", "no-show"],
    default: "scheduled",
  })
  status: string;

  @Column({ nullable: true })
  encounterId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}