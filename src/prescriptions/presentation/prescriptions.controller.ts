import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { PrescriptionsService } from '../application/prescriptions.service';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { CreatePrescriptionForPatientDto } from './dto/create-prescription-for-patient.dto';
import { ListPrescriptionsQueryDto } from './dto/list-prescriptions.query.dto';
import { UpdatePrescriptionDto } from './dto/update-prescription.dto';

@ApiTags('Prescriptions')
@Controller()
export class PrescriptionsController {
  constructor(private readonly prescriptionsService: PrescriptionsService) {}

  @Post('patients/:patientId/prescriptions')
  @ApiParam({ name: 'patientId', description: 'Patient ID' })
  async add(
    @Param('patientId', ParseIntPipe) patientId: number,
    @Body() dto: CreatePrescriptionDto,
  ) {
    return await this.prescriptionsService.addToPatient({
      patientId,
      ...dto,
    });
  }

  @Get('patients/:patientId/prescriptions')
  @ApiParam({ name: 'patientId', description: 'Patient ID' })
  async list(
    @Param('patientId', ParseIntPipe) patientId: number,
    @Query() query: ListPrescriptionsQueryDto,
  ) {
    return await this.prescriptionsService.listForPatient({
      patientId,
      page: query.page ?? 1,
      limit: query.limit ?? 20,
    });
  }

  @Post('prescriptions')
  async create(@Body() dto: CreatePrescriptionForPatientDto) {
    return await this.prescriptionsService.createPrescription(dto);
  }

  @Get('prescriptions')
  async listAll(@Query() query: ListPrescriptionsQueryDto) {
    return await this.prescriptionsService.listPrescriptions({
      page: query.page ?? 1,
      limit: query.limit ?? 20,
    });
  }

  @Get('prescriptions/:id')
  @ApiParam({ name: 'id', description: 'Prescription ID' })
  async get(@Param('id', ParseIntPipe) id: number) {
    return await this.prescriptionsService.getPrescription(id);
  }

  @Patch('prescriptions/:id')
  @ApiParam({ name: 'id', description: 'Prescription ID' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePrescriptionDto,
  ) {
    return await this.prescriptionsService.updatePrescription(id, dto);
  }

  @Delete('prescriptions/:id')
  @ApiParam({ name: 'id', description: 'Prescription ID' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.prescriptionsService.deletePrescription(id);
    return { ok: true };
  }
}

