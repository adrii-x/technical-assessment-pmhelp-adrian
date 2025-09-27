import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { MedicalRecordsService } from './medical-records.service';
import { CreateMedicalRecordDto } from './dto/create-medical-record.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '@prisma/client';

// Define the user type from JWT payload
interface AuthenticatedUser {
  userId: number;
  email: string;
  role: UserRole;
}

interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
}

@Controller('medical-records')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MedicalRecordsController {
  constructor(private medicalRecordsService: MedicalRecordsService) {}

  @Post()
  @Roles('DOCTOR')
  async create(
    @Body() dto: CreateMedicalRecordDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.medicalRecordsService.create(dto, req.user.userId);
  }

  @Get('my')
  @Roles('PATIENT')
  async findMy(@Request() req: AuthenticatedRequest) {
    return this.medicalRecordsService.findMyRecords(req.user.userId);
  }

  @Get()
  @Roles('DOCTOR', 'ADMIN')
  async findAll(@Request() req: AuthenticatedRequest) {
    return this.medicalRecordsService.findAll(req.user.userId, req.user.role);
  }
}
