import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EncounterService } from './encounter.service';
import { EncounterController } from './encounter.controller';
import { Encounter } from './encounter.entity';

/**
 * EncounterModule - Module for medical encounter management
 * 
 * Features:
 * - CRUD operations for encounters
 * - Search and pagination
 * - Auto-generated encounter IDs
 * - Relationships with Patient and User entities
 * - JWT authentication on all endpoints
 * 
 * Exports EncounterService for use in other modules
 */
@Module({
  imports: [TypeOrmModule.forFeature([Encounter])], // Register Encounter entity with TypeORM
  controllers: [EncounterController], // REST API endpoints
  providers: [EncounterService], // Business logic service
  exports: [EncounterService], // Make service available to other modules
})
export class EncounterModule {}