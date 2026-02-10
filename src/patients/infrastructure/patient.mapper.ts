import { Patient } from '../domain/patient';
import { PatientOrmEntity } from './patient.orm-entity';

export function toDomainPatient(entity: PatientOrmEntity): Patient {
  return {
    id: entity.id,
    name: entity.name,
    lastName: entity.lastName,
    email: entity.email,
    phone: entity.phone,
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
  };
}

