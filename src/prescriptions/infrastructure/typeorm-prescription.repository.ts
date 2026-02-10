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
    patientId: number;
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

  async findById(id: number) {
    const entity = await this.repo.findOne({ where: { id } });
    return entity ? toDomainPrescription(entity) : null;
  }

  async update(
    id: number,
    input: {
      medicationName?: string;
      dosage?: string;
      instructions?: string;
    },
  ) {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) return null;
    if (typeof input.medicationName === 'string') {
      entity.medicationName = input.medicationName;
    }
    if (typeof input.dosage === 'string') entity.dosage = input.dosage;
    if (typeof input.instructions === 'string') {
      entity.instructions = input.instructions;
    }
    const saved = await this.repo.save(entity);
    return toDomainPrescription(saved);
  }

  async delete(id: number) {
    const res = await this.repo.delete({ id });
    return Boolean(res.affected);
  }

  async list(args: { page: number; limit: number }): Promise<PrescriptionListResult> {
    const skip = (args.page - 1) * args.limit;
    const [rows, total] = await this.repo.findAndCount({
      order: { createdAt: 'DESC' },
      skip,
      take: args.limit,
    });
    return {
      data: rows.map(toDomainPrescription),
      total,
    };
  }

  async listByPatientId(args: {
    patientId: number;
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

