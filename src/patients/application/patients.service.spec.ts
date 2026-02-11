import { NotFoundException } from '@nestjs/common';
import { PatientsService } from './patients.service';
import type {
  PatientRepositoryPort,
  PatientListResult,
} from '../domain/patient.repository.port';
import type { Patient } from '../domain/patient';

function makePatient(overrides: Partial<Patient> = {}): Patient {
  return {
    id: 1,
    name: 'Ada',
    lastName: 'Lovelace',
    email: 'ada@lovelace.dev',
    phone: '+1-555-123-4567',
    createdAt: new Date('2026-02-01T00:00:00.000Z'),
    updatedAt: new Date('2026-02-01T00:00:00.000Z'),
    ...overrides,
  };
}

describe('PatientsService (unit)', () => {
  const makeRepo = (
    partial: Partial<PatientRepositoryPort> = {},
  ): PatientRepositoryPort =>
    ({
      create: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      exists: jest.fn(),
      list: jest.fn(),
      ...partial,
    }) as unknown as PatientRepositoryPort;

  it('creates a patient via repository', async () => {
    const patient = makePatient({ id: 10 });
    const repo = makeRepo({
      create: jest.fn().mockResolvedValue(patient),
    });
    const service = new PatientsService(repo);

    await expect(
      service.createPatient({
        name: 'Ada',
        lastName: 'Lovelace',
        email: 'ada@lovelace.dev',
        phone: '+1-555-123-4567',
      }),
    ).resolves.toEqual(patient);

    expect(repo.create).toHaveBeenCalledTimes(1);
  });

  it('throws NotFoundException when getting missing patient', async () => {
    const repo = makeRepo({
      findById: jest.fn().mockResolvedValue(null),
    });
    const service = new PatientsService(repo);

    await expect(service.getPatient(123)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('updates a patient via repository (happy path)', async () => {
    const updated = makePatient({ id: 7, phone: '+1-555-000-0000' });
    const repo = makeRepo({
      update: jest.fn().mockResolvedValue(updated),
    });
    const service = new PatientsService(repo);

    await expect(
      service.updatePatient(7, { phone: '+1-555-000-0000' }),
    ).resolves.toEqual(updated);

    expect(repo.update).toHaveBeenCalledWith(7, { phone: '+1-555-000-0000' });
  });

  it('lists patients as a paginated response', async () => {
    const repoResult: PatientListResult = {
      data: [makePatient({ id: 1 }), makePatient({ id: 2 })],
      total: 12,
    };
    const repo = makeRepo({
      list: jest.fn().mockResolvedValue(repoResult),
    });
    const service = new PatientsService(repo);

    const res = await service.listPatients({ page: 2, limit: 5, q: 'ada' });

    expect(repo.list).toHaveBeenCalledWith({ page: 2, limit: 5, q: 'ada' });
    expect(res).toEqual({
      data: repoResult.data,
      page: 2,
      limit: 5,
      total: 12,
      totalPages: 3,
    });
  });

  it('throws NotFoundException when deleting missing patient', async () => {
    const repo = makeRepo({
      delete: jest.fn().mockResolvedValue(false),
    });
    const service = new PatientsService(repo);

    await expect(service.deletePatient(1)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});

