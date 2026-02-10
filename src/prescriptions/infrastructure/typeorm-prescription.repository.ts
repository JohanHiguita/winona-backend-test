import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  PrescriptionListResult,
  PrescriptionRepositoryPort,
} from '../domain/prescription.repository.port';
import { PrescriptionOrmEntity } from './prescription.orm-entity';
import { toDomainPrescription } from './prescription.mapper';

export class TypeOrmPrescriptionRepository implements PrescriptionRepositoryPort {
  constructor(
    @InjectRepository(PrescriptionOrmEntity)
    private readonly repo: Repository<PrescriptionOrmEntity>,
  ) {}

  async create(input: {
    patientId: string;
    medicationName: string;
    dosage?: string;
    instructions?: string;
  }) {
    const entity = this.repo.create({
      patientId: input.patientId,
      medicationName: input.medicationName,
      dosage: input.dosage ?? null,
      instructions: input.instructions ?? null,
    });
    const saved = await this.repo.save(entity);
    return toDomainPrescription(saved);
  }

  async listByPatientId(args: {
    patientId: string;
    page: number;
    limit: number;
  }): Promise<PrescriptionListResult> {
    const skip = (args.page - 1) * args.limit;
    const [rows, total] = await this.repo.findAndCount({
      where: { patientId: args.patientId },
      order: { createdAt: 'DESC' },
      skip,
      take: args.limit,
    });
    return {
      data: rows.map(toDomainPrescription),
      total,
    };
  }
}

