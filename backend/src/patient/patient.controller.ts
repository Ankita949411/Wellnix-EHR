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
  UseInterceptors,
  HttpStatus,
} from "@nestjs/common";
import { PatientService } from "./patient.service";
import { CreatePatientDto } from "./dto/create-patient.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { ResponseInterceptor } from "../common/response.interceptor";

/**
 * PatientController handles HTTP requests for patient management.
 * All endpoints require JWT authentication and use response interceptor for consistent formatting.
 */
@Controller("patients")
@UseGuards(JwtAuthGuard)
@UseInterceptors(ResponseInterceptor)
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  /**
   * Creates a new patient record.
   * @param createPatientDto Patient data from request body
   * @returns Created patient with success message
   */
  @Post()
  async create(@Body() createPatientDto: CreatePatientDto) {
    try {
      const patient = await this.patientService.create(createPatientDto);
      return {
        statusCode: HttpStatus.CREATED,
        message: "Patient created successfully",
        data: patient,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      };
    }
  }

  /**
   * Retrieves paginated list of patients with optional search.
   * @param query Query parameters (page, limit, search)
   * @returns Paginated patient list with metadata
   */
  @Get("list")
  async findAll(@Query() query: any) {
    try {
      // Validate and sanitize query parameters
      const page = Math.max(1, parseInt(query.page) || 1);
      const limit = Math.max(1, Math.min(100, parseInt(query.limit) || 10));
      const search = query.search?.trim() || undefined;

      const result = await this.patientService.findAll(page, limit, search);
      return {
        statusCode: HttpStatus.OK,
        message: "Patients retrieved successfully",
        data: result,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      };
    }
  }

  /**
   * Retrieves a single patient by ID.
   * @param id Patient's database ID from URL parameter
   * @returns Patient data or 404 if not found
   */
  @Get(":id")
  async findOne(@Param("id") id: string) {
    try {
      const patient = await this.patientService.findOne(+id);
      if (!patient) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: "Patient not found",
        };
      }
      return {
        statusCode: HttpStatus.OK,
        message: "Patient retrieved successfully",
        data: patient,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      };
    }
  }

  /**
   * Updates an existing patient record.
   * @param id Patient's database ID from URL parameter
   * @param updateData Partial patient data to update
   * @returns Updated patient data
   */
  @Patch(":id")
  async update(@Param("id") id: string, @Body() updateData: any) {
    try {
      const patient = await this.patientService.update(+id, updateData);
      return {
        statusCode: HttpStatus.OK,
        message: "Patient updated successfully",
        data: patient,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      };
    }
  }

  /**
   * Soft deletes a patient by deactivating their record.
   * This preserves patient data for historical and legal compliance.
   * @param id Patient's database ID from URL parameter
   * @returns Deactivated patient data or 404 if not found
   */
  @Delete(":id")
  async remove(@Param("id") id: string) {
    try {
      const patient = await this.patientService.remove(+id);
      if (!patient) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: "Patient not found",
        };
      }
      return {
        statusCode: HttpStatus.OK,
        message: "Patient deactivated successfully",
        data: patient,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      };
    }
  }
}
