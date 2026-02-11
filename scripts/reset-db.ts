import { DataSource } from 'typeorm';
import { join } from 'node:path';
import { PatientOrmEntity } from '../src/patients/infrastructure/patient.orm-entity';
import { PrescriptionOrmEntity } from '../src/prescriptions/infrastructure/prescription.orm-entity';

async function reset() {
  const dbPath =
    process.env.DB_PATH ?? join(process.cwd(), 'data', 'app.sqlite');

  const dataSource = new DataSource({
    type: 'better-sqlite3',
    database: dbPath,
    entities: [PatientOrmEntity, PrescriptionOrmEntity],
    synchronize: false,
  });

  await dataSource.initialize();
  const queryRunner = dataSource.createQueryRunner();

  await queryRunner.query('DELETE FROM prescriptions');
  await queryRunner.query('DELETE FROM patients');

  await queryRunner.release();
  await dataSource.destroy();

  // eslint-disable-next-line no-console
  console.log('Cleared records from patients and prescriptions.');
}

reset().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('Database reset failed:', error);
  process.exit(1);
});
