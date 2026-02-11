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
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/infrastructure/jwt-auth.guard';
import { ErrorResponseDto } from '../../common/dto/error-response.dto';
import { OkResponseDto } from '../../common/dto/ok.response.dto';
import { ApiPaginatedResponse } from '../../common/pagination/api-paginated-response.decorator';
import { PatientsService } from '../application/patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { PatientResponseDto } from './dto/patient.response.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { ListPatientsQueryDto } from './dto/list-patients.query.dto';

@ApiTags('Patients')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a patient' })
  @ApiCreatedResponse({ type: PatientResponseDto })
  @ApiBadRequestResponse({ type: ErrorResponseDto })
  @ApiUnauthorizedResponse({ type: ErrorResponseDto })
  async create(@Body() dto: CreatePatientDto) {
    return await this.patientsService.createPatient(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List patients (paginated)' })
  @ApiPaginatedResponse(PatientResponseDto)
  @ApiBadRequestResponse({ type: ErrorResponseDto })
  @ApiUnauthorizedResponse({ type: ErrorResponseDto })
  async list(@Query() query: ListPatientsQueryDto) {
    return await this.patientsService.listPatients({
      page: query.page ?? 1,
      limit: query.limit ?? 20,
      q: query.q,
    });
  }

  @Get(':id')
  @ApiParam({ name: 'id', description: 'Patient ID' })
  @ApiOperation({ summary: 'Get a patient by id' })
  @ApiOkResponse({ type: PatientResponseDto })
  @ApiNotFoundResponse({ type: ErrorResponseDto })
  @ApiBadRequestResponse({ type: ErrorResponseDto })
  @ApiUnauthorizedResponse({ type: ErrorResponseDto })
  async get(@Param('id', ParseIntPipe) id: number) {
    return await this.patientsService.getPatient(id);
  }

  @Patch(':id')
  @ApiParam({ name: 'id', description: 'Patient ID' })
  @ApiOperation({ summary: 'Update a patient by id' })
  @ApiOkResponse({ type: PatientResponseDto })
  @ApiNotFoundResponse({ type: ErrorResponseDto })
  @ApiBadRequestResponse({ type: ErrorResponseDto })
  @ApiUnauthorizedResponse({ type: ErrorResponseDto })
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePatientDto) {
    return await this.patientsService.updatePatient(id, dto);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', description: 'Patient ID' })
  @ApiOperation({ summary: 'Delete a patient by id' })
  @ApiOkResponse({ type: OkResponseDto })
  @ApiNotFoundResponse({ type: ErrorResponseDto })
  @ApiBadRequestResponse({ type: ErrorResponseDto })
  @ApiUnauthorizedResponse({ type: ErrorResponseDto })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.patientsService.deletePatient(id);
    return { ok: true };
  }
}

