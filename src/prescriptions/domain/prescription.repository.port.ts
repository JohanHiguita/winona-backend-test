import { Prescription } from './prescription';

export const PRESCRIPTION_REPOSITORY = Symbol('PRESCRIPTION_REPOSITORY');

export type PrescriptionListResult = {
  data: Prescription[];
  total: number;
};

export interface PrescriptionRepositoryPort {
  create(input: {
    patientId: number;
    medicationName: string;
    dosage?: string;
    instructions?: string;
  }): Promise<Prescription>;

  findById(id: number): Promise<Prescription | null>;
  update(
    id: number,
    input: {
      medicationName?: string;
      dosage?: string;
      instructions?: string;
    },
  ): Promise<Prescription | null>;
  delete(id: number): Promise<boolean>;

  list(args: { page: number; limit: number }): Promise<PrescriptionListResult>;
  listByPatientId(args: {
    patientId: number;
    page: number;
    limit: number;
  }): Promise<PrescriptionListResult>;
}

