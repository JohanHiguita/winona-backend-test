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
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/infrastructure/jwt-auth.guard';
import { PatientsService } from '../application/patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { ListPatientsQueryDto } from './dto/list-patients.query.dto';

@ApiTags('Patients')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
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
  async get(@Param('id', ParseIntPipe) id: number) {
    return await this.patientsService.getPatient(id);
  }

  @Patch(':id')
  @ApiParam({ name: 'id', description: 'Patient ID' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePatientDto) {
    return await this.patientsService.updatePatient(id, dto);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', description: 'Patient ID' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.patientsService.deletePatient(id);
    return { ok: true };
  }
}

