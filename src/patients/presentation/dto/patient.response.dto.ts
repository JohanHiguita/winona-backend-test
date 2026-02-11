import { ApiProperty } from '@nestjs/swagger';

export class PatientResponseDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 'Ada' })
  name!: string;

  @ApiProperty({ example: 'Lovelace' })
  lastName!: string;

  @ApiProperty({ example: 'ada@lovelace.dev' })
  email!: string;

  @ApiProperty({ example: '+1-555-123-4567' })
  phone!: string;

  @ApiProperty({ example: '2026-02-10T20:00:00.000Z', format: 'date-time' })
  createdAt!: Date;

  @ApiProperty({ example: '2026-02-10T20:00:00.000Z', format: 'date-time' })
  updatedAt!: Date;
}

