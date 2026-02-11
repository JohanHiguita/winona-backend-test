import { NotFoundException } from '@nestjs/common';
import { PrescriptionsService } from './prescriptions.service';
import type { PatientRepositoryPort } from '../../patients/domain/patient.repository.port';
import type {
  PrescriptionRepositoryPort,
  PrescriptionListResult,
} from '../domain/prescription.repository.port';
import type { Prescription } from '../domain/prescription';

function makePrescription(
  overrides: Partial<Prescription> = {},
): Prescription {
  return {
    id: 1,
    patientId: 10,
    medicationName: 'Amoxicillin',
    dosage: '500mg',
    instructions: 'Once daily',
    createdAt: new Date('2026-02-01T00:00:00.000Z'),
    ...overrides,
  };
}

describe('PrescriptionsService (unit)', () => {
  const makePatientsRepo = (
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

  const makePrescriptionsRepo = (
    partial: Partial<PrescriptionRepositoryPort> = {},
  ): PrescriptionRepositoryPort =>
    ({
      create: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      list: jest.fn(),
      listByPatientId: jest.fn(),
      ...partial,
    }) as unknown as PrescriptionRepositoryPort;

  it('throws NotFoundException when creating prescription for missing patient', async () => {
    const patientsRepo = makePatientsRepo({
      exists: jest.fn().mockResolvedValue(false),
    });
    const prescriptionsRepo = makePrescriptionsRepo();
    const service = new PrescriptionsService(prescriptionsRepo, patientsRepo);

    await expect(
      service.addToPatient({
        patientId: 999,
        medicationName: 'Metformin',
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('creates prescription when patient exists', async () => {
    const rx = makePrescription({ id: 5, patientId: 10 });
    const patientsRepo = makePatientsRepo({
      exists: jest.fn().mockResolvedValue(true),
    });
    const prescriptionsRepo = makePrescriptionsRepo({
      create: jest.fn().mockResolvedValue(rx),
    });
    const service = new PrescriptionsService(prescriptionsRepo, patientsRepo);

    await expect(
      service.addToPatient({
        patientId: 10,
        medicationName: 'Metformin',
        dosage: '500mg',
      }),
    ).resolves.toEqual(rx);
  });

  it('lists prescriptions for patient as paginated response', async () => {
    const repoResult: PrescriptionListResult = {
      data: [makePrescription({ id: 1 }), makePrescription({ id: 2 })],
      total: 6,
    };

    const patientsRepo = makePatientsRepo({
      exists: jest.fn().mockResolvedValue(true),
    });
    const prescriptionsRepo = makePrescriptionsRepo({
      listByPatientId: jest.fn().mockResolvedValue(repoResult),
    });
    const service = new PrescriptionsService(prescriptionsRepo, patientsRepo);

    const res = await service.listForPatient({
      patientId: 10,
      page: 1,
      limit: 2,
    });

    expect(res).toEqual({
      data: repoResult.data,
      page: 1,
      limit: 2,
      total: 6,
      totalPages: 3,
    });
  });
});

