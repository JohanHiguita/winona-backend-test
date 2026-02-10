import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PatientOrmEntity } from '../../patients/infrastructure/patient.orm-entity';

@Entity({ name: 'prescriptions' })
export class PrescriptionOrmEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Index()
  @Column({ type: 'integer' })
  patientId!: number;

  @ManyToOne(() => PatientOrmEntity, (p) => p.prescriptions, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'patientId' })
  patient!: PatientOrmEntity;

  @Column({ type: 'text' })
  medicationName!: string;

  @Column({ type: 'text', nullable: true })
  dosage?: string | null;

  @Column({ type: 'text', nullable: true })
  instructions?: string | null;

  @CreateDateColumn({ type: 'datetime' })
  createdAt!: Date;
}

