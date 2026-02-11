import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PrescriptionResponseDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 1 })
  patientId!: number;

  @ApiProperty({ example: 'Amoxicillin' })
  medicationName!: string;

  @ApiPropertyOptional({ example: '500mg' })
  dosage?: string | null;

  @ApiPropertyOptional({ example: 'Take after meals for 7 days.' })
  instructions?: string | null;

  @ApiProperty({ example: '2026-02-10T20:00:00.000Z', format: 'date-time' })
  createdAt!: Date;
}

