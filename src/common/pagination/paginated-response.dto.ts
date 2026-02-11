import { ApiProperty } from '@nestjs/swagger';

export class PaginatedResponseDto {
  @ApiProperty({ example: 1, minimum: 1 })
  page!: number;

  @ApiProperty({ example: 20, minimum: 1 })
  limit!: number;

  @ApiProperty({ example: 123, minimum: 0 })
  total!: number;

  @ApiProperty({ example: 7, minimum: 1 })
  totalPages!: number;

  // `data` is documented via ApiPaginatedResponse(model)
  @ApiProperty({ type: 'array', items: { type: 'object' } })
  data!: unknown[];
}

