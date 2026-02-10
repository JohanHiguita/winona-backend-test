import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { PrescriptionsService } from '../application/prescriptions.service';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { ListPrescriptionsQueryDto } from './dto/list-prescriptions.query.dto';

@ApiTags('Prescriptions')
@Controller('patients/:patientId/prescriptions')
export class PrescriptionsController {
  constructor(private readonly prescriptionsService: PrescriptionsService) {}

  @Post()
  @ApiParam({ name: 'patientId', description: 'Patient ID' })
  async add(
    @Param('patientId') patientId: string,
    @Body() dto: CreatePrescriptionDto,
  ) {
    return await this.prescriptionsService.addToPatient({
      patientId,
      ...dto,
    });
  }

  @Get()
  @ApiParam({ name: 'patientId', description: 'Patient ID' })
  async list(
    @Param('patientId') patientId: string,
    @Query() query: ListPrescriptionsQueryDto,
  ) {
    return await this.prescriptionsService.listForPatient({
      patientId,
      page: query.page ?? 1,
      limit: query.limit ?? 20,
    });
  }
}

