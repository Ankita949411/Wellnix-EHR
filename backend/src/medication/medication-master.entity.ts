import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("medication_master")
export class MedicationMaster {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  genericName: string;

  @Column({ nullable: true })
  brandName: string;

  @Column({
    type: "enum",
    enum: ["tablet", "capsule", "syrup", "injection", "inhaler", "cream", "drops", "patch"],
  })
  dosageForm: string;

  @Column()
  strength: string;

  @Column({ nullable: true })
  manufacturer: string;

  @Column({
    type: "enum",
    enum: ["antibiotic", "analgesic", "antihypertensive", "antidiabetic", "antihistamine", "other"],
  })
  classification: string;

  @Column("text", { nullable: true })
  description: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}