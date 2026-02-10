import { Patient } from './patient';

export const PATIENT_REPOSITORY = Symbol('PATIENT_REPOSITORY');

export type PatientListResult = {
  data: Patient[];
  total: number;
};

export interface PatientRepositoryPort {
  create(input: { fullName: string }): Promise<Patient>;
  findById(id: string): Promise<Patient | null>;
  update(id: string, input: { fullName?: string }): Promise<Patient | null>;
  delete(id: string): Promise<boolean>;
  exists(id: string): Promise<boolean>;
  list(args: { page: number; limit: number; q?: string }): Promise<PatientListResult>;
}

