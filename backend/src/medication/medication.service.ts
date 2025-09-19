import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { MedicationMaster } from "./medication-master.entity";
import { PatientMedication } from "./patient-medication.entity";
import { CreateMedicationMasterDto } from "./dto/create-medication-master.dto";
import { CreatePatientMedicationDto } from "./dto/create-patient-medication.dto";

@Injectable()
export class MedicationService {
  constructor(
    @InjectRepository(MedicationMaster)
    private medicationMasterRepository: Repository<MedicationMaster>,
    @InjectRepository(PatientMedication)
    private patientMedicationRepository: Repository<PatientMedication>,
  ) {}

  // Medication Master methods
  async createMedicationMaster(dto: CreateMedicationMasterDto): Promise<MedicationMaster> {
    const medication = this.medicationMasterRepository.create(dto);
    return await this.medicationMasterRepository.save(medication);
  }

  async findAllMedicationMaster(page: number = 1, limit: number = 10, search?: string) {
    const skip = (page - 1) * limit;
    
    const queryBuilder = this.medicationMasterRepository
      .createQueryBuilder("medication")
      .where("medication.isActive = :isActive", { isActive: true });

    if (search) {
      queryBuilder.andWhere(
        "(medication.genericName ILIKE :search OR medication.brandName ILIKE :search OR medication.manufacturer ILIKE :search)",
        { search: `%${search}%` }
      );
    }

    const [medications, total] = await queryBuilder
      .orderBy("medication.genericName", "ASC")
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      medications,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOneMedicationMaster(id: string): Promise<MedicationMaster> {
    const medication = await this.medicationMasterRepository.findOne({ where: { id } });
    if (!medication) {
      throw new NotFoundException("Medication not found");
    }
    return medication;
  }

  // Patient Medication methods
  async createPatientMedication(dto: CreatePatientMedicationDto): Promise<PatientMedication> {
    const medication = this.patientMedicationRepository.create({
      ...dto,
      startDate: new Date(dto.startDate),
      endDate: dto.endDate ? new Date(dto.endDate) : null,
    });
    return await this.patientMedicationRepository.save(medication);
  }

  async findPatientMedications(patientId: number, status?: string) {
    const queryBuilder = this.patientMedicationRepository
      .createQueryBuilder("pm")
      .leftJoinAndSelect("pm.medication", "medication")
      .leftJoinAndSelect("pm.provider", "provider")
      .where("pm.patientId = :patientId", { patientId });

    if (status) {
      queryBuilder.andWhere("pm.status = :status", { status });
    }

    return await queryBuilder
      .orderBy("pm.startDate", "DESC")
      .getMany();
  }

  async updatePatientMedication(id: string, updateData: Partial<CreatePatientMedicationDto>): Promise<PatientMedication> {
    const medication = await this.patientMedicationRepository.findOne({ where: { id } });
    if (!medication) {
      throw new NotFoundException("Patient medication not found");
    }

    if (updateData.startDate) {
      updateData.startDate = new Date(updateData.startDate) as any;
    }
    if (updateData.endDate) {
      updateData.endDate = new Date(updateData.endDate) as any;
    }

    Object.assign(medication, updateData);
    return await this.patientMedicationRepository.save(medication);
  }

  async discontinuePatientMedication(id: string, reason?: string): Promise<PatientMedication> {
    const medication = await this.patientMedicationRepository.findOne({ where: { id } });
    if (!medication) {
      throw new NotFoundException("Patient medication not found");
    }

    medication.status = "discontinued";
    medication.endDate = new Date();
    if (reason) {
      medication.reason = reason;
    }

    return await this.patientMedicationRepository.save(medication);
  }
}