import { DataSource } from 'typeorm';
import { join } from 'node:path';
import { PatientOrmEntity } from '../src/patients/infrastructure/patient.orm-entity';
import { PrescriptionOrmEntity } from '../src/prescriptions/infrastructure/prescription.orm-entity';

type SeedOptions = {
  patients: number;
};

const firstNames = [
  'Ava',
  'Liam',
  'Noah',
  'Emma',
  'Olivia',
  'Mia',
  'Ethan',
  'Sophia',
  'James',
  'Isabella',
  'Lucas',
  'Amelia',
];

const lastNames = [
  'Garcia',
  'Nguyen',
  'Patel',
  'Smith',
  'Brown',
  'Johnson',
  'Miller',
  'Davis',
  'Wilson',
  'Taylor',
  'Clark',
  'Walker',
];

const medications = [
  'Ibuprofen',
  'Amoxicillin',
  'Metformin',
  'Atorvastatin',
  'Lisinopril',
  'Omeprazole',
  'Levothyroxine',
  'Amlodipine',
  'Azithromycin',
  'Hydrochlorothiazide',
];

const dosages = ['5 mg', '10 mg', '20 mg', '250 mg', '500 mg'];

const instructions = [
  'Take once daily with water.',
  'Take twice daily after meals.',
  'Take every 8 hours as needed.',
  'Take once daily before bedtime.',
  'Take with food to avoid stomach upset.',
];

function toInt(value: string | undefined, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function parseArgs(argv: string[]): SeedOptions {
  const defaultPatients = 100;
  let patients = toInt(process.env.npm_config_patients, defaultPatients);

  for (const raw of argv) {
    if (!raw.startsWith('--')) continue;
    const [key, value] = raw.replace(/^--/, '').split('=');
    if (key === 'patients') patients = toInt(value, patients);
  }

  if (patients < 1) patients = 1;
  return { patients };
}

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function seed() {
  const args = parseArgs(process.argv.slice(2));
  const dbPath =
    process.env.DB_PATH ?? join(process.cwd(), 'data', 'app.sqlite');

  const dataSource = new DataSource({
    type: 'better-sqlite3',
    database: dbPath,
    entities: [PatientOrmEntity, PrescriptionOrmEntity],
    synchronize: true,
    dropSchema: false,
  });

  await dataSource.initialize();
  const patientRepo = dataSource.getRepository(PatientOrmEntity);
  const prescriptionRepo = dataSource.getRepository(PrescriptionOrmEntity);

  for (let i = 1; i <= args.patients; i += 1) {
    const name = firstNames[(i - 1) % firstNames.length];
    const lastName = lastNames[(i - 1) % lastNames.length];
    const email = `${name.toLowerCase()}.${lastName.toLowerCase()}.${i}@example.com`;
    const phone = `+1-555-${String(i).padStart(4, '0')}`;

    const patient = await patientRepo.save(
      patientRepo.create({ name, lastName, email, phone }),
    );

    const count = randomInt(0, 5);
    for (let p = 0; p < count; p += 1) {
      const medicationName = medications[(i + p) % medications.length];
      await prescriptionRepo.save(
        prescriptionRepo.create({
          patientId: patient.id,
          medicationName,
          dosage: dosages[(i + p) % dosages.length],
          instructions: instructions[(i + p) % instructions.length],
        }),
      );
    }
  }

  await dataSource.destroy();
  // eslint-disable-next-line no-console
  console.log(
    `Seeded ${args.patients} patients with 0-5 prescriptions each.`,
  );
}

seed().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('Seeding failed:', error);
  process.exit(1);
});
