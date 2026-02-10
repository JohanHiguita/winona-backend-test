import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PaginatedResponse, toPaginatedResponse } from '../../common/pagination/paginated.response';
import { PATIENT_REPOSITORY } from '../domain/patient.repository.port';
import type { PatientRepositoryPort } from '../domain/patient.repository.port';
import { Patient } from '../domain/patient';

@Injectable()
export class PatientsService {
  constructor(
    @Inject(PATIENT_REPOSITORY)
    private readonly patientsRepo: PatientRepositoryPort,
  ) {}

  async createPatient(input: {
    name: string;
    lastName: string;
    email: string;
    phone: string;
  }): Promise<Patient> {
    return await this.patientsRepo.create(input);
  }

  async getPatient(id: string): Promise<Patient> {
    const patient = await this.patientsRepo.findById(id);
    if (!patient) throw new NotFoundException('Patient not found');
    return patient;
  }

  async updatePatient(
    id: string,
    input: {
      name?: string;
      lastName?: string;
      email?: string;
      phone?: string;
    },
  ): Promise<Patient> {
    const patient = await this.patientsRepo.update(id, input);
    if (!patient) throw new NotFoundException('Patient not found');
    return patient;
  }

  async deletePatient(id: string): Promise<void> {
    const ok = await this.patientsRepo.delete(id);
    if (!ok) throw new NotFoundException('Patient not found');
  }

  async listPatients(args: {
    page: number;
    limit: number;
    q?: string;
  }): Promise<PaginatedResponse<Patient>> {
    const page = args.page;
    const limit = args.limit;
    const result = await this.patientsRepo.list(args);
    return toPaginatedResponse({
      data: result.data,
      total: result.total,
      page,
      limit,
    });
  }
}

