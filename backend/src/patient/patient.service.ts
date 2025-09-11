import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from './patient.entity';
import { CreatePatientDto } from './dto/create-patient.dto';

/**
 * PatientService handles all patient-related database operations and business logic.
 * Provides CRUD operations, search functionality, and patient ID generation.
 */
@Injectable()
export class PatientService {
  /**
   * Injects the Patient repository for database access.
   */
  constructor(
    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,
  ) {}

  /**
   * Creates a new patient record with auto-generated patient ID.
   * @param createPatientDto Patient data for creation
   * @returns Promise<Patient> The created patient record
   */
  async create(createPatientDto: CreatePatientDto): Promise<Patient> {
    const patientId = this.generatePatientId();
    const patient = this.patientRepository.create({
      ...createPatientDto,
      patientId,
      dateOfBirth: new Date(createPatientDto.dateOfBirth),
    });
    return this.patientRepository.save(patient);
  }

  /**
   * Returns paginated list of active patients with optional search functionality.
   * @param page Page number (default: 1)
   * @param limit Number of records per page (default: 10)
   * @param search Optional search term for name or patient ID
   * @returns Paginated patient list with metadata
   */
  async findAll(page: number = 1, limit: number = 10, search?: string) {
    const queryBuilder = this.patientRepository
      .createQueryBuilder('patient')
      .where('patient.isActive = :isActive', { isActive: true });

    // Add search functionality for name and patient ID
    if (search) {
      queryBuilder.andWhere(
        '(patient.firstName ILIKE :search OR patient.lastName ILIKE :search OR patient.patientId ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    const [patients, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('patient.createdAt', 'DESC')
      .getManyAndCount();

    return {
      patients,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Finds a single patient by their ID.
   * @param id Patient's database ID
   * @returns Promise<Patient> The patient record or null if not found
   */
  async findOne(id: number): Promise<Patient> {
    return this.patientRepository.findOne({ where: { id } });
  }

  /**
   * Updates a patient record with new data.
   * @param id Patient's database ID
   * @param updateData Partial patient data to update
   * @returns Promise<Patient> The updated patient record
   */
  async update(id: number, updateData: Partial<Patient>): Promise<Patient> {
    await this.patientRepository.update(id, updateData);
    return this.findOne(id);
  }

  /**
   * Soft deletes a patient by setting isActive to false.
   * This preserves patient data for historical records.
   * @param id Patient's database ID
   * @returns Promise<Patient> The deactivated patient record or null if not found
   */
  async remove(id: number): Promise<Patient> {
    const patient = await this.findOne(id);
    if (patient) {
      patient.isActive = false;
      return this.patientRepository.save(patient);
    }
    return null;
  }

  /**
   * Generates a unique patient ID using timestamp and random number.
   * Format: P + last 6 digits of timestamp + 3-digit random number
   * Example: P123456789
   * @returns string Unique patient identifier
   */
  private generatePatientId(): string {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `P${timestamp.slice(-6)}${random}`;
  }
}