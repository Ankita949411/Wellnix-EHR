import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Like } from "typeorm";
import { Encounter } from "./encounter.entity";
import { CreateEncounterDto } from "./dto/create-encounter.dto";

/**
 * EncounterService - Handles business logic for medical encounters
 * Provides CRUD operations, search functionality, and encounter ID generation
 */
@Injectable()
export class EncounterService {
  constructor(
    @InjectRepository(Encounter)
    private encounterRepository: Repository<Encounter>
  ) {}

  /**
   * Create a new encounter with auto-generated encounter ID
   * @param createEncounterDto - Data for creating the encounter
   * @returns Promise<Encounter> - The created encounter
   */
  async create(createEncounterDto: CreateEncounterDto & { appointmentId?: string }): Promise<Encounter> {
    // Generate unique encounter ID
    const encounterId = await this.generateEncounterId();

    // Create encounter entity with provided data
    const encounter = this.encounterRepository.create({
      ...createEncounterDto,
      encounterId,
      encounterDate: new Date(createEncounterDto.encounterDate),
    });

    const savedEncounter = await this.encounterRepository.save(encounter);

    // Link appointment if provided
    if (createEncounterDto.appointmentId) {
      // This would require injecting AppointmentService, but keeping it simple
      // The frontend can handle the linking via separate API calls
    }

    return savedEncounter;
  }

  /**
   * Retrieve paginated list of encounters with optional search
   * @param page - Page number (default: 1)
   * @param limit - Items per page (default: 10)
   * @param search - Search term for filtering
   * @returns Paginated encounter results
   */
  async findAll(page: number = 1, limit: number = 10, search?: string) {
    const skip = (page - 1) * limit;

    // Build query with patient and provider relationships
    const queryBuilder = this.encounterRepository
      .createQueryBuilder("encounter")
      .leftJoinAndSelect("encounter.patient", "patient")
      .leftJoinAndSelect("encounter.provider", "provider");

    // Apply search filter if provided
    if (search) {
      queryBuilder.where(
        "(patient.firstName ILIKE :search OR patient.lastName ILIKE :search OR encounter.encounterId ILIKE :search OR encounter.chiefComplaint ILIKE :search)",
        { search: `%${search}%` }
      );
    }

    // Execute query with pagination and sorting
    const [encounters, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .orderBy("encounter.encounterDate", "DESC")
      .getManyAndCount();

    return {
      encounters,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Find a single encounter by ID
   * @param id - Encounter UUID
   * @returns Promise<Encounter> - The found encounter
   * @throws NotFoundException if encounter not found
   */
  async findOne(id: string): Promise<Encounter> {
    const encounter = await this.encounterRepository.findOne({
      where: { id },
      relations: ["patient", "provider"],
    });

    if (!encounter) {
      throw new NotFoundException("Encounter not found");
    }

    return encounter;
  }

  /**
   * Update an existing encounter
   * @param id - Encounter UUID
   * @param updateData - Partial encounter data to update
   * @returns Promise<Encounter> - The updated encounter
   */
  async update(id: string, updateData: Partial<Encounter>): Promise<Encounter> {
    const encounter = await this.findOne(id);

    // Convert date string to Date object if provided
    if (updateData.encounterDate) {
      updateData.encounterDate = new Date(updateData.encounterDate);
    }

    // Apply updates and save
    Object.assign(encounter, updateData);
    return await this.encounterRepository.save(encounter);
  }

  /**
   * Soft delete an encounter by setting status to cancelled
   * @param id - Encounter UUID
   * @returns Promise<Encounter> - The cancelled encounter
   */
  async remove(id: string): Promise<Encounter> {
    const encounter = await this.findOne(id);
    encounter.status = "cancelled";
    return await this.encounterRepository.save(encounter);
  }

  /**
   * Generate unique encounter ID in format: ENC + YYYYMMDD + sequence
   * Example: ENC20241201001
   * @returns Promise<string> - Generated encounter ID
   */
  private async generateEncounterId(): Promise<string> {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    // Get current count for sequence number
    const count = await this.encounterRepository.count();
    const sequence = String(count + 1).padStart(4, "0");

    return `ENC${year}${month}${day}${sequence}`;
  }
}
