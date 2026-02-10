import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PrescriptionOrmEntity } from '../../prescriptions/infrastructure/prescription.orm-entity';

@Entity({ name: 'patients' })
export class PatientOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'text' })
  fullName!: string;

  @CreateDateColumn({ type: 'datetime' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt!: Date;

  @OneToMany(() => PrescriptionOrmEntity, (p) => p.patient, {
    cascade: false,
  })
  prescriptions?: PrescriptionOrmEntity[];
}

