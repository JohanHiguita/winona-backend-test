import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  PatientListResult,
  PatientRepositoryPort,
} from '../domain/patient.repository.port';
import { PatientOrmEntity } from './patient.orm-entity';
import { toDomainPatient } from './patient.mapper';

export class TypeOrmPatientRepository implements PatientRepositoryPort {
  constructor(
    @InjectRepository(PatientOrmEntity)
    private readonly repo: Repository<PatientOrmEntity>,
  ) {}

  async create(input: { fullName: string }) {
    const entity = this.repo.create({ fullName: input.fullName });
    const saved = await this.repo.save(entity);
    return toDomainPatient(saved);
  }

  async findById(id: string) {
    const entity = await this.repo.findOne({ where: { id } });
    return entity ? toDomainPatient(entity) : null;
  }

  async update(id: string, input: { fullName?: string }) {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) return null;
    if (typeof input.fullName === 'string') entity.fullName = input.fullName;
    const saved = await this.repo.save(entity);
    return toDomainPatient(saved);
  }

  async delete(id: string) {
    const res = await this.repo.delete({ id });
    return Boolean(res.affected);
  }

  async exists(id: string) {
    return await this.repo.exists({ where: { id } });
  }

  async list(args: {
    page: number;
    limit: number;
    q?: string;
  }): Promise<PatientListResult> {
    const page = args.page;
    const limit = args.limit;
    const skip = (page - 1) * limit;

    const qb = this.repo.createQueryBuilder('p');
    if (args.q?.trim()) {
      qb.where('LOWER(p.fullName) LIKE :q', {
        q: `%${args.q.trim().toLowerCase()}%`,
      });
    }
    qb.orderBy('p.createdAt', 'DESC').skip(skip).take(limit);

    const [rows, total] = await qb.getManyAndCount();
    return {
      data: rows.map(toDomainPatient),
      total,
    };
  }
}

