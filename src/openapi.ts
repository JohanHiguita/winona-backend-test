import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function exportOpenApi() {
  const app = await NestFactory.create(AppModule, { logger: false });
  await app.init();

  const config = new DocumentBuilder()
    .setTitle('Winona Backend Assessment Test API')
    .setDescription('API endpoints for the Winona Backend Assessment Test API')
    .setVersion('0.0.1')
    .addTag('Core')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  const outPath = resolve(process.cwd(), 'openapi.json');
  await writeFile(outPath, JSON.stringify(document, null, 2), 'utf8');
  await app.close();

  // eslint-disable-next-line no-console
  console.log(`OpenAPI exported to ${outPath}`);
}

exportOpenApi().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});

