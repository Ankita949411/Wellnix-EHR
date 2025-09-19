import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MedicationService } from "./medication.service";
import { MedicationController } from "./medication.controller";
import { MedicationMaster } from "./medication-master.entity";
import { PatientMedication } from "./patient-medication.entity";

@Module({
  imports: [TypeOrmModule.forFeature([MedicationMaster, PatientMedication])],
  controllers: [MedicationController],
  providers: [MedicationService],
  exports: [MedicationService],
})
export class MedicationModule {}