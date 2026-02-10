import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'node:path';
import { PatientsModule } from './patients/patients.module';
import { PrescriptionsModule } from './prescriptions/prescriptions.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: join(process.cwd(), 'data', 'app.sqlite'),
      autoLoadEntities: true,
      synchronize: true,
      logging: ['error', 'warn'],
    }),
    PatientsModule,
    PrescriptionsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
