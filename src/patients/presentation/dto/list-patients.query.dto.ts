import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';
import { PaginationDto } from '../../../common/pagination/pagination.dto';

export class ListPatientsQueryDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Filtro simple por nombre (contiene, case-insensitive)',
    example: 'ada',
  })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  q?: string;
}

