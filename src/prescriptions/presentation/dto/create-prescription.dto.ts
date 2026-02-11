import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';
const trimString = (value: unknown) =>
  typeof value === 'string' ? value.trim() : value;
const trimToUndefined = (value: unknown) => {
  if (typeof value !== 'string') return value;
  const trimmed = value.trim();
  return trimmed.length === 0 ? undefined : trimmed;
};

export class CreatePrescriptionDto {
  @ApiProperty({ example: 'Amoxicillin' })
  @Transform(({ value }) => trimString(value))
  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Za-z0-9][A-Za-z0-9 .,'()/-]*$/, {
    message: 'Medication name contains invalid characters.',
  })
  @MaxLength(200)
  medicationName!: string;

  @ApiPropertyOptional({ example: '500mg' })
  @Transform(({ value }) => trimToUndefined(value))
  @IsOptional()
  @IsString()
  @MaxLength(100)
  dosage?: string;

  @ApiPropertyOptional({ example: 'Take after meals for 7 days.' })
  @Transform(({ value }) => trimToUndefined(value))
  @IsOptional()
  @IsString()
  @Matches(/^[A-Za-z0-9 .,'()"\/:;!?%-]*$/, {
    message: 'Instructions contain invalid characters.',
  })
  @MaxLength(500)
  instructions?: string;
}

