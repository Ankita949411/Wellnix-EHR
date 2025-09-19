import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UseGuards,
  HttpStatus,
} from "@nestjs/common";
import { MedicationService } from "./medication.service";
import { CreateMedicationMasterDto } from "./dto/create-medication-master.dto";
import { CreatePatientMedicationDto } from "./dto/create-patient-medication.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { ApiResponse } from "../common/interfaces/api-response.interface";

@Controller("medications")
@UseGuards(JwtAuthGuard)
export class MedicationController {
  constructor(private readonly medicationService: MedicationService) {}

  // Medication Master endpoints
  @Post("master")
  async createMedicationMaster(@Body() dto: CreateMedicationMasterDto): Promise<ApiResponse> {
    try {
      const medication = await this.medicationService.createMedicationMaster(dto);
      return {
        success: true,
        message: "Medication created successfully",
        data: medication,
        statusCode: HttpStatus.CREATED,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Failed to create medication",
        statusCode: HttpStatus.BAD_REQUEST,
        timestamp: new Date().toISOString(),
      };
    }
  }

  @Get("master")
  async findAllMedicationMaster(
    @Query("page") page: string = "1",
    @Query("limit") limit: string = "10",
    @Query("search") search?: string,
  ): Promise<ApiResponse> {
    try {
      const result = await this.medicationService.findAllMedicationMaster(
        parseInt(page),
        parseInt(limit),
        search,
      );
      return {
        success: true,
        message: "Medications retrieved successfully",
        data: result,
        statusCode: HttpStatus.OK,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Failed to retrieve medications",
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        timestamp: new Date().toISOString(),
      };
    }
  }

  @Get("master/:id")
  async findOneMedicationMaster(@Param("id") id: string): Promise<ApiResponse> {
    try {
      const medication = await this.medicationService.findOneMedicationMaster(id);
      return {
        success: true,
        message: "Medication retrieved successfully",
        data: medication,
        statusCode: HttpStatus.OK,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Failed to retrieve medication",
        statusCode: HttpStatus.NOT_FOUND,
        timestamp: new Date().toISOString(),
      };
    }
  }

  // Patient Medication endpoints
  @Post("patient")
  async createPatientMedication(@Body() dto: CreatePatientMedicationDto): Promise<ApiResponse> {
    try {
      const medication = await this.medicationService.createPatientMedication(dto);
      return {
        success: true,
        message: "Patient medication created successfully",
        data: medication,
        statusCode: HttpStatus.CREATED,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Failed to create patient medication",
        statusCode: HttpStatus.BAD_REQUEST,
        timestamp: new Date().toISOString(),
      };
    }
  }

  @Get("patient/:patientId")
  async findPatientMedications(
    @Param("patientId") patientId: string,
    @Query("status") status?: string,
  ): Promise<ApiResponse> {
    try {
      const medications = await this.medicationService.findPatientMedications(
        parseInt(patientId),
        status,
      );
      return {
        success: true,
        message: "Patient medications retrieved successfully",
        data: medications,
        statusCode: HttpStatus.OK,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Failed to retrieve patient medications",
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        timestamp: new Date().toISOString(),
      };
    }
  }

  @Patch("patient/:id")
  async updatePatientMedication(
    @Param("id") id: string,
    @Body() updateData: Partial<CreatePatientMedicationDto>,
  ): Promise<ApiResponse> {
    try {
      const medication = await this.medicationService.updatePatientMedication(id, updateData);
      return {
        success: true,
        message: "Patient medication updated successfully",
        data: medication,
        statusCode: HttpStatus.OK,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Failed to update patient medication",
        statusCode: HttpStatus.BAD_REQUEST,
        timestamp: new Date().toISOString(),
      };
    }
  }

  @Patch("patient/:id/discontinue")
  async discontinuePatientMedication(
    @Param("id") id: string,
    @Body("reason") reason?: string,
  ): Promise<ApiResponse> {
    try {
      const medication = await this.medicationService.discontinuePatientMedication(id, reason);
      return {
        success: true,
        message: "Patient medication discontinued successfully",
        data: medication,
        statusCode: HttpStatus.OK,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Failed to discontinue patient medication",
        statusCode: HttpStatus.BAD_REQUEST,
        timestamp: new Date().toISOString(),
      };
    }
  }
}