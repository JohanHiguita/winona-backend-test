import { Patient } from '../domain/patient';
import { PatientOrmEntity } from './patient.orm-entity';

export function toDomainPatient(entity: PatientOrmEntity): Patient {
  return {
    id: entity.id,
    fullName: entity.fullName,
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
  };
}

