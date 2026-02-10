import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientsModule } from '../patients/patients.module';
import { PrescriptionsService } from './application/prescriptions.service';
import {
  PRESCRIPTION_REPOSITORY,
} from './domain/prescription.repository.port';
import { PrescriptionOrmEntity } from './infrastructure/prescription.orm-entity';
import { TypeOrmPrescriptionRepository } from './infrastructure/typeorm-prescription.repository';
import { PrescriptionsController } from './presentation/prescriptions.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PrescriptionOrmEntity]), PatientsModule],
  controllers: [PrescriptionsController],
  providers: [
    PrescriptionsService,
    {
      provide: PRESCRIPTION_REPOSITORY,
      useClass: TypeOrmPrescriptionRepository,
    },
  ],
})
export class PrescriptionsModule {}

