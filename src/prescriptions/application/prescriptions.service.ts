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

  async createPrescription(args: {
    patientId: number;
    medicationName: string;
    dosage?: string;
    instructions?: string;
  }): Promise<Prescription> {
    return await this.addToPatient(args);
  }

  async getPrescription(id: number): Promise<Prescription> {
    const prescription = await this.prescriptionsRepo.findById(id);
    if (!prescription) throw new NotFoundException('Prescription not found');
    return prescription;
  }

  async updatePrescription(
    id: number,
    input: {
      medicationName?: string;
      dosage?: string;
      instructions?: string;
    },
  ): Promise<Prescription> {
    const updated = await this.prescriptionsRepo.update(id, input);
    if (!updated) throw new NotFoundException('Prescription not found');
    return updated;
  }

  async deletePrescription(id: number): Promise<void> {
    const ok = await this.prescriptionsRepo.delete(id);
    if (!ok) throw new NotFoundException('Prescription not found');
  }

  async listPrescriptions(args: {
    page: number;
    limit: number;
  }): Promise<PaginatedResponse<Prescription>> {
    const result = await this.prescriptionsRepo.list(args);
    return toPaginatedResponse({
      data: result.data,
      total: result.total,
      page: args.page,
      limit: args.limit,
    });
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

