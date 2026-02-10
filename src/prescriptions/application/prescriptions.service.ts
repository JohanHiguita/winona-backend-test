import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PaginatedResponse, toPaginatedResponse } from '../../common/pagination/paginated.response';
import { PATIENT_REPOSITORY } from '../../patients/domain/patient.repository.port';
import type { PatientRepositoryPort } from '../../patients/domain/patient.repository.port';
import { Prescription } from '../domain/prescription';
import { PRESCRIPTION_REPOSITORY } from '../domain/prescription.repository.port';
import type { PrescriptionRepositoryPort } from '../domain/prescription.repository.port';

@Injectable()
export class PrescriptionsService {
  constructor(
    @Inject(PRESCRIPTION_REPOSITORY)
    private readonly prescriptionsRepo: PrescriptionRepositoryPort,
    @Inject(PATIENT_REPOSITORY)
    private readonly patientsRepo: PatientRepositoryPort,
  ) {}

  async addToPatient(args: {
    patientId: number;
    medicationName: string;
    dosage?: string;
    instructions?: string;
  }): Promise<Prescription> {
    const exists = await this.patientsRepo.exists(args.patientId);
    if (!exists) throw new NotFoundException('Patient not found');

    return await this.prescriptionsRepo.create(args);
  }

  async listForPatient(args: {
    patientId: number;
    page: number;
    limit: number;
  }): Promise<PaginatedResponse<Prescription>> {
    const exists = await this.patientsRepo.exists(args.patientId);
    if (!exists) throw new NotFoundException('Patient not found');

    const result = await this.prescriptionsRepo.listByPatientId(args);
    return toPaginatedResponse({
      data: result.data,
      total: result.total,
      page: args.page,
      limit: args.limit,
    });
  }
}

