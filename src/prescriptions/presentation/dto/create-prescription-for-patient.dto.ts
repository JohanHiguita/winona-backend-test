import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';
import { CreatePrescriptionDto } from './create-prescription.dto';

export class CreatePrescriptionForPatientDto extends CreatePrescriptionDto {
  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  patientId!: number;
}
