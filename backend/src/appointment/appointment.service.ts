import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Like } from "typeorm";
import { Appointment } from "./appointment.entity";
import { CreateAppointmentDto } from "./dto/create-appointment.dto";

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
  ) {}

  async create(createAppointmentDto: CreateAppointmentDto): Promise<Appointment> {
    const appointmentId = await this.generateAppointmentId();
    
    const appointment = this.appointmentRepository.create({
      ...createAppointmentDto,
      appointmentId,
      appointmentDate: new Date(createAppointmentDto.appointmentDate),
    });

    return await this.appointmentRepository.save(appointment);
  }

  async findAll(page: number = 1, limit: number = 10, search?: string) {
    const skip = (page - 1) * limit;
    
    const queryBuilder = this.appointmentRepository
      .createQueryBuilder("appointment")
      .leftJoinAndSelect("appointment.patient", "patient")
      .leftJoinAndSelect("appointment.provider", "provider");

    if (search) {
      queryBuilder.where(
        "appointment.appointmentId ILIKE :search OR appointment.reason ILIKE :search OR patient.firstName ILIKE :search OR patient.lastName ILIKE :search OR provider.firstName ILIKE :search OR provider.lastName ILIKE :search",
        { search: `%${search}%` }
      );
    }

    const [appointments, total] = await queryBuilder
      .orderBy("appointment.appointmentDate", "DESC")
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      appointments,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findOne({
      where: { id },
      relations: ["patient", "provider"],
    });

    if (!appointment) {
      throw new NotFoundException("Appointment not found");
    }

    return appointment;
  }

  async update(id: string, updateData: Partial<CreateAppointmentDto>): Promise<Appointment> {
    const appointment = await this.findOne(id);
    
    if (updateData.appointmentDate) {
      updateData.appointmentDate = new Date(updateData.appointmentDate) as any;
    }

    Object.assign(appointment, updateData);
    return await this.appointmentRepository.save(appointment);
  }

  async remove(id: string): Promise<void> {
    const appointment = await this.findOne(id);
    await this.appointmentRepository.remove(appointment);
  }

  async checkIn(id: string): Promise<Appointment> {
    const appointment = await this.findOne(id);
    appointment.status = "checked-in";
    return await this.appointmentRepository.save(appointment);
  }

  async linkEncounter(appointmentId: string, encounterId: string): Promise<Appointment> {
    const appointment = await this.findOne(appointmentId);
    appointment.encounterId = encounterId;
    appointment.status = "completed";
    return await this.appointmentRepository.save(appointment);
  }

  private async generateAppointmentId(): Promise<string> {
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, "");
    
    const lastAppointment = await this.appointmentRepository
      .createQueryBuilder("appointment")
      .where("appointment.appointmentId LIKE :pattern", { pattern: `APT${dateStr}%` })
      .orderBy("appointment.appointmentId", "DESC")
      .getOne();

    let sequence = 1;
    if (lastAppointment) {
      const lastSequence = parseInt(lastAppointment.appointmentId.slice(-3));
      sequence = lastSequence + 1;
    }

    return `APT${dateStr}${sequence.toString().padStart(3, "0")}`;
  }
}