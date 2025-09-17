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
} from '@nestjs/common';
import { EncounterService } from './encounter.service';
import { CreateEncounterDto } from './dto/create-encounter.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ResponseInterceptor } from '../common/response.interceptor';

/**
 * EncounterController - REST API endpoints for medical encounter management
 * All endpoints require JWT authentication
 * Responses are standardized using ResponseInterceptor
 */
@Controller('encounters')
@UseGuards(JwtAuthGuard)
@UseInterceptors(ResponseInterceptor)
export class EncounterController {
  constructor(private readonly encounterService: EncounterService) {}

  /**
   * Create a new encounter
   * @param createEncounterDto - Encounter data from request body
   * @returns Created encounter with success message
   */
  @Post()
  async create(@Body() createEncounterDto: CreateEncounterDto) {
    try {
      const encounter = await this.encounterService.create(createEncounterDto);
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Encounter created successfully',
        data: encounter,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      };
    }
  }

  /**
   * Get paginated list of encounters with optional search
   * @param page - Page number (query parameter)
   * @param limit - Items per page (query parameter)
   * @param search - Search term (query parameter)
   * @returns Paginated encounter list
   */
  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search?: string,
  ) {
    try {
      const result = await this.encounterService.findAll(page, limit, search);
      return {
        statusCode: HttpStatus.OK,
        message: 'Encounters retrieved successfully',
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
   * Get a single encounter by ID
   * @param id - Encounter UUID from URL parameter
   * @returns Encounter details with patient and provider information
   */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const encounter = await this.encounterService.findOne(id);
      return {
        statusCode: HttpStatus.OK,
        message: 'Encounter retrieved successfully',
        data: encounter,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.NOT_FOUND,
        message: error.message,
      };
    }
  }

  /**
   * Update an existing encounter
   * @param id - Encounter UUID from URL parameter
   * @param updateData - Partial encounter data from request body
   * @returns Updated encounter
   */
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateData: any) {
    try {
      const encounter = await this.encounterService.update(id, updateData);
      return {
        statusCode: HttpStatus.OK,
        message: 'Encounter updated successfully',
        data: encounter,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      };
    }
  }

  /**
   * Cancel an encounter (soft delete)
   * @param id - Encounter UUID from URL parameter
   * @returns Cancelled encounter with updated status
   */
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const encounter = await this.encounterService.remove(id);
      return {
        statusCode: HttpStatus.OK,
        message: 'Encounter cancelled successfully',
        data: encounter,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      };
    }
  }
}