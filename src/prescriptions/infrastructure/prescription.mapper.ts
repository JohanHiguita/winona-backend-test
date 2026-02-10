import { Prescription } from '../domain/prescription';
import { PrescriptionOrmEntity } from './prescription.orm-entity';

export function toDomainPrescription(entity: PrescriptionOrmEntity): Prescription {
  return {
    id: entity.id,
    patientId: entity.patientId,
    medicationName: entity.medicationName,
    dosage: entity.dosage ?? null,
    instructions: entity.instructions ?? null,
    createdAt: entity.createdAt,
  };
}

