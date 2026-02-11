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
import { PrescriptionsService } from '../application/prescriptions.service';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { CreatePrescriptionForPatientDto } from './dto/create-prescription-for-patient.dto';
import { ListPrescriptionsQueryDto } from './dto/list-prescriptions.query.dto';
import { PrescriptionResponseDto } from './dto/prescription.response.dto';
import { UpdatePrescriptionDto } from './dto/update-prescription.dto';

@ApiTags('Prescriptions')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller()
export class PrescriptionsController {
  constructor(private readonly prescriptionsService: PrescriptionsService) {}

  @Post('patients/:patientId/prescriptions')
  @ApiParam({ name: 'patientId', description: 'Patient ID' })
  @ApiOperation({ summary: 'Create a prescription for a patient' })
  @ApiCreatedResponse({ type: PrescriptionResponseDto })
  @ApiBadRequestResponse({ type: ErrorResponseDto })
  @ApiUnauthorizedResponse({ type: ErrorResponseDto })
  @ApiNotFoundResponse({ type: ErrorResponseDto })
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
  @ApiOperation({ summary: 'List prescriptions for a patient (paginated)' })
  @ApiPaginatedResponse(PrescriptionResponseDto)
  @ApiBadRequestResponse({ type: ErrorResponseDto })
  @ApiUnauthorizedResponse({ type: ErrorResponseDto })
  @ApiNotFoundResponse({ type: ErrorResponseDto })
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
  @ApiOperation({
    summary: 'Create a prescription (patientId in body)',
    description:
      'Convenience endpoint. Prefer POST /patients/:patientId/prescriptions to avoid duplicating patientId.',
  })
  @ApiCreatedResponse({ type: PrescriptionResponseDto })
  @ApiBadRequestResponse({ type: ErrorResponseDto })
  @ApiUnauthorizedResponse({ type: ErrorResponseDto })
  @ApiNotFoundResponse({ type: ErrorResponseDto })
  async create(@Body() dto: CreatePrescriptionForPatientDto) {
    return await this.prescriptionsService.createPrescription(dto);
  }

  @Get('prescriptions')
  @ApiOperation({ summary: 'List prescriptions (paginated)' })
  @ApiPaginatedResponse(PrescriptionResponseDto)
  @ApiBadRequestResponse({ type: ErrorResponseDto })
  @ApiUnauthorizedResponse({ type: ErrorResponseDto })
  async listAll(@Query() query: ListPrescriptionsQueryDto) {
    return await this.prescriptionsService.listPrescriptions({
      page: query.page ?? 1,
      limit: query.limit ?? 20,
    });
  }

  @Get('prescriptions/:id')
  @ApiParam({ name: 'id', description: 'Prescription ID' })
  @ApiOperation({ summary: 'Get a prescription by id' })
  @ApiOkResponse({ type: PrescriptionResponseDto })
  @ApiBadRequestResponse({ type: ErrorResponseDto })
  @ApiUnauthorizedResponse({ type: ErrorResponseDto })
  @ApiNotFoundResponse({ type: ErrorResponseDto })
  async get(@Param('id', ParseIntPipe) id: number) {
    return await this.prescriptionsService.getPrescription(id);
  }

  @Patch('prescriptions/:id')
  @ApiParam({ name: 'id', description: 'Prescription ID' })
  @ApiOperation({ summary: 'Update a prescription by id' })
  @ApiOkResponse({ type: PrescriptionResponseDto })
  @ApiBadRequestResponse({ type: ErrorResponseDto })
  @ApiUnauthorizedResponse({ type: ErrorResponseDto })
  @ApiNotFoundResponse({ type: ErrorResponseDto })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePrescriptionDto,
  ) {
    return await this.prescriptionsService.updatePrescription(id, dto);
  }

  @Delete('prescriptions/:id')
  @ApiParam({ name: 'id', description: 'Prescription ID' })
  @ApiOperation({ summary: 'Delete a prescription by id' })
  @ApiOkResponse({ type: OkResponseDto })
  @ApiBadRequestResponse({ type: ErrorResponseDto })
  @ApiUnauthorizedResponse({ type: ErrorResponseDto })
  @ApiNotFoundResponse({ type: ErrorResponseDto })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.prescriptionsService.deletePrescription(id);
    return { ok: true };
  }
}

