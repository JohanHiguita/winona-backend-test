import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { PatientsService } from '../application/patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { ListPatientsQueryDto } from './dto/list-patients.query.dto';

@ApiTags('Patients')
@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Post()
  async create(@Body() dto: CreatePatientDto) {
    return await this.patientsService.createPatient(dto);
  }

  @Get()
  async list(@Query() query: ListPatientsQueryDto) {
    return await this.patientsService.listPatients({
      page: query.page ?? 1,
      limit: query.limit ?? 20,
      q: query.q,
    });
  }

  @Get(':id')
  @ApiParam({ name: 'id', description: 'Patient ID' })
  async get(@Param('id') id: string) {
    return await this.patientsService.getPatient(id);
  }

  @Patch(':id')
  @ApiParam({ name: 'id', description: 'Patient ID' })
  async update(@Param('id') id: string, @Body() dto: UpdatePatientDto) {
    return await this.patientsService.updatePatient(id, dto);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', description: 'Patient ID' })
  async remove(@Param('id') id: string) {
    await this.patientsService.deletePatient(id);
    return { ok: true };
  }
}

