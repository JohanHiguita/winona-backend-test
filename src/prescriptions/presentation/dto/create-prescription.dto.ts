import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreatePrescriptionDto {
  @ApiProperty({ example: 'Amoxicillin' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  medicationName!: string;

  @ApiPropertyOptional({ example: '500mg' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  dosage?: string;

  @ApiPropertyOptional({ example: 'Take after meals for 7 days.' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  instructions?: string;
}

