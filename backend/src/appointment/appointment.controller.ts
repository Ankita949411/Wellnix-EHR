import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpStatus,
} from "@nestjs/common";
import { AppointmentService } from "./appointment.service";
import { CreateAppointmentDto } from "./dto/create-appointment.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { ApiResponse } from "../common/interfaces/api-response.interface";

@Controller("appointments")
@UseGuards(JwtAuthGuard)
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post()
  async create(@Body() createAppointmentDto: CreateAppointmentDto): Promise<ApiResponse> {
    try {
      const appointment = await this.appointmentService.create(createAppointmentDto);
      return {
        success: true,
        message: "Appointment created successfully",
        data: appointment,
        statusCode: HttpStatus.CREATED,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Failed to create appointment",
        statusCode: HttpStatus.BAD_REQUEST,
        timestamp: new Date().toISOString(),
      };
    }
  }

  @Get()
  async findAll(
    @Query("page") page: string = "1",
    @Query("limit") limit: string = "10",
    @Query("search") search?: string,
  ): Promise<ApiResponse> {
    try {
      const result = await this.appointmentService.findAll(
        parseInt(page),
        parseInt(limit),
        search,
      );
      return {
        success: true,
        message: "Appointments retrieved successfully",
        data: result,
        statusCode: HttpStatus.OK,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Failed to retrieve appointments",
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        timestamp: new Date().toISOString(),
      };
    }
  }

  @Get(":id")
  async findOne(@Param("id") id: string): Promise<ApiResponse> {
    try {
      const appointment = await this.appointmentService.findOne(id);
      return {
        success: true,
        message: "Appointment retrieved successfully",
        data: appointment,
        statusCode: HttpStatus.OK,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Failed to retrieve appointment",
        statusCode: HttpStatus.NOT_FOUND,
        timestamp: new Date().toISOString(),
      };
    }
  }

  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() updateAppointmentDto: Partial<CreateAppointmentDto>,
  ): Promise<ApiResponse> {
    try {
      const appointment = await this.appointmentService.update(id, updateAppointmentDto);
      return {
        success: true,
        message: "Appointment updated successfully",
        data: appointment,
        statusCode: HttpStatus.OK,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Failed to update appointment",
        statusCode: HttpStatus.BAD_REQUEST,
        timestamp: new Date().toISOString(),
      };
    }
  }

  @Delete(":id")
  async remove(@Param("id") id: string): Promise<ApiResponse> {
    try {
      await this.appointmentService.remove(id);
      return {
        success: true,
        message: "Appointment deleted successfully",
        statusCode: HttpStatus.OK,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Failed to delete appointment",
        statusCode: HttpStatus.BAD_REQUEST,
        timestamp: new Date().toISOString(),
      };
    }
  }

  @Patch(":id/check-in")
  async checkIn(@Param("id") id: string): Promise<ApiResponse> {
    try {
      const appointment = await this.appointmentService.checkIn(id);
      return {
        success: true,
        message: "Patient checked in successfully",
        data: appointment,
        statusCode: HttpStatus.OK,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Failed to check in patient",
        statusCode: HttpStatus.BAD_REQUEST,
        timestamp: new Date().toISOString(),
      };
    }
  }
}