import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';
const trimString = (value: unknown) =>
  typeof value === 'string' ? value.trim() : value;

export class CreatePatientDto {
  @ApiProperty({ example: 'Ada' })
  @Transform(({ value }) => trimString(value))
  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Za-z][A-Za-z' -]*$/, {
    message: 'Name contains invalid characters.',
  })
  @MaxLength(100)
  name!: string;

  @ApiProperty({ example: 'Lovelace' })
  @Transform(({ value }) => trimString(value))
  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Za-z][A-Za-z' -]*$/, {
    message: 'Last name contains invalid characters.',
  })
  @MaxLength(100)
  lastName!: string;

  @ApiProperty({ example: 'ada@lovelace.dev' })
  @Transform(({ value }) => trimString(value))
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(254)
  email!: string;

  @ApiProperty({ example: '+1-555-123-4567' })
  @Transform(({ value }) => trimString(value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  phone!: string;
}

