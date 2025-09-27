import {
  Controller,
  Get,
  Param,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { MedicalRecordsService } from '../medical-records/medical-records.service';
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

@Controller('patients')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PatientsController {
  constructor(private medicalRecordsService: MedicalRecordsService) {}

  @Get(':id/records')
  @Roles('DOCTOR', 'ADMIN')
  async getPatientRecords(
    @Param('id', ParseIntPipe) patientId: number,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.medicalRecordsService.findPatientRecords(
      patientId,
      req.user.userId,
      req.user.role,
    );
  }
}
