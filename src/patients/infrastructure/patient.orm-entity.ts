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
  name!: string;

  @Column({ type: 'text' })
  lastName!: string;

  @Column({ type: 'text' })
  email!: string;

  @Column({ type: 'text' })
  phone!: string;

  @CreateDateColumn({ type: 'datetime' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt!: Date;

  @OneToMany(() => PrescriptionOrmEntity, (p) => p.patient, {
    cascade: false,
  })
  prescriptions?: PrescriptionOrmEntity[];
}

