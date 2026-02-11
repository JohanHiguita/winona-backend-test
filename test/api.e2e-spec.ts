import { ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { rmSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { AllExceptionsFilter } from '../src/common/filters/http-exception.filter';

describe('API (e2e)', () => {
  let app: INestApplication;
  let token: string;
  let dbPath: string;

  beforeAll(async () => {
    process.env.JWT_SECRET = 'e2e-secret';
    process.env.AUTH_USERNAME = 'admin';
    process.env.AUTH_PASSWORD = 'admin';
    process.env.JWT_EXPIRES_IN_SECONDS = '3600';

    dbPath = join(tmpdir(), `winona-e2e-${randomUUID()}.sqlite`);
    process.env.DB_PATH = dbPath;

    // Important: require AFTER env vars are set, because modules read process.env at import time.
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { AppModule } = require('../src/app.module');

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );
    app.useGlobalFilters(new AllExceptionsFilter());
    await app.init();

    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'admin', password: 'admin' })
      .expect(200);
    token = loginRes.body.access_token;
    expect(typeof token).toBe('string');
    expect(token.length).toBeGreaterThan(10);
  });

  afterAll(async () => {
    await app?.close();
    rmSync(dbPath, { force: true });
  });

  it('rejects protected routes without JWT', async () => {
    await request(app.getHttpServer()).get('/patients').expect(401);
  });

  it('creates, lists, updates and deletes a patient', async () => {
    const createRes = await request(app.getHttpServer())
      .post('/patients')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Ada',
        lastName: 'Lovelace',
        email: 'ada@lovelace.dev',
        phone: '+1-555-123-4567',
      })
      .expect(201);

    const patientId = createRes.body.id;
    expect(typeof patientId).toBe('number');

    await request(app.getHttpServer())
      .get('/patients?page=1&limit=10')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('data');
        expect(res.body).toHaveProperty('total');
        expect(res.body).toHaveProperty('page', 1);
        expect(res.body).toHaveProperty('limit', 10);
      });

    await request(app.getHttpServer())
      .patch(`/patients/${patientId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ phone: '+1-555-000-0000' })
      .expect(200)
      .expect((res) => {
        expect(res.body.phone).toBe('+1-555-000-0000');
      });

    await request(app.getHttpServer())
      .delete(`/patients/${patientId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect({ ok: true });

    await request(app.getHttpServer())
      .get(`/patients/${patientId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404);
  });

  it('validates input and returns standard error shape', async () => {
    await request(app.getHttpServer())
      .post('/patients')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Ada',
        lastName: 'Lovelace',
        email: 'not-an-email',
        phone: '+1-555-123-4567',
      })
      .expect(400)
      .expect((res) => {
        expect(res.body).toHaveProperty('statusCode', 400);
        expect(res.body).toHaveProperty('error');
        expect(res.body).toHaveProperty('message');
        expect(res.body).toHaveProperty('details');
        expect(Array.isArray(res.body.details)).toBe(true);
      });
  });

  it('creates and lists prescriptions for a patient', async () => {
    const createPatient = await request(app.getHttpServer())
      .post('/patients')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Grace',
        lastName: 'Hopper',
        email: 'grace@hopper.dev',
        phone: '+1-555-987-6543',
      })
      .expect(201);

    const patientId = createPatient.body.id;

    await request(app.getHttpServer())
      .post(`/patients/${patientId}/prescriptions`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        medicationName: 'Metformin',
        dosage: '500mg',
        instructions: 'Once daily',
      })
      .expect(201)
      .expect((res) => {
        expect(res.body.patientId).toBe(patientId);
        expect(res.body.medicationName).toBe('Metformin');
      });

    await request(app.getHttpServer())
      .get(`/patients/${patientId}/prescriptions?page=1&limit=10`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('data');
        expect(res.body.data.length).toBeGreaterThan(0);
        expect(res.body).toHaveProperty('page', 1);
      });
  });
});

