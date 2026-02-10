import { Patient } from './patient';

export const PATIENT_REPOSITORY = Symbol('PATIENT_REPOSITORY');

export type PatientListResult = {
  data: Patient[];
  total: number;
};

export interface PatientRepositoryPort {
  create(input: {
    name: string;
    lastName: string;
    email: string;
    phone: string;
  }): Promise<Patient>;
  findById(id: number): Promise<Patient | null>;
  update(
    id: number,
    input: {
      name?: string;
      lastName?: string;
      email?: string;
      phone?: string;
    },
  ): Promise<Patient | null>;
  delete(id: number): Promise<boolean>;
  exists(id: number): Promise<boolean>;
  list(args: { page: number; limit: number; q?: string }): Promise<PatientListResult>;
}

