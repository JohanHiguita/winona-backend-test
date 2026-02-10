import { Prescription } from './prescription';

export const PRESCRIPTION_REPOSITORY = Symbol('PRESCRIPTION_REPOSITORY');

export type PrescriptionListResult = {
  data: Prescription[];
  total: number;
};

export interface PrescriptionRepositoryPort {
  create(input: {
    patientId: string;
    medicationName: string;
    dosage?: string;
    instructions?: string;
  }): Promise<Prescription>;

  listByPatientId(args: {
    patientId: string;
    page: number;
    limit: number;
  }): Promise<PrescriptionListResult>;
}

