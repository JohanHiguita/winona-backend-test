import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreatePatientDto {
  @ApiProperty({ example: 'Ada Lovelace' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  fullName!: string;
}

