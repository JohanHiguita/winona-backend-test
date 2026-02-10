import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientsService } from './application/patients.service';
import { PatientOrmEntity } from './infrastructure/patient.orm-entity';
import { PatientsController } from './presentation/patients.controller';
import { PATIENT_REPOSITORY,} from './domain/patient.repository.port';
import { TypeOrmPatientRepository } from './infrastructure/typeorm-patient.repository';

@Module({
  imports: [TypeOrmModule.forFeature([PatientOrmEntity])],
  controllers: [PatientsController],
  providers: [
    PatientsService,
    {
      provide: PATIENT_REPOSITORY,
      useClass: TypeOrmPatientRepository,
    },
  ],
  exports: [PATIENT_REPOSITORY],
})
export class PatientsModule {}

