// src/appointments/appointments.controller.ts
import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { AppointmentsService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
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

@Controller('appointments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AppointmentsController {
  constructor(private appointmentsService: AppointmentsService) {}

  @Post()
  @Roles('PATIENT')
  async create(
    @Body() dto: CreateAppointmentDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.appointmentsService.create(dto, req.user.userId);
  }

  @Get()
  @Roles('DOCTOR', 'ADMIN')
  async findAll(@Request() req: AuthenticatedRequest) {
    return this.appointmentsService.findAllForUser(
      req.user.userId,
      req.user.role,
    );
  }

  @Get('my')
  @Roles('PATIENT')
  async findMy(@Request() req: AuthenticatedRequest) {
    return this.appointmentsService.findMyAppointments(req.user.userId);
  }

  @Patch(':id')
  @Roles('PATIENT', 'DOCTOR', 'ADMIN')
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAppointmentDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.appointmentsService.updateStatus(
      id,
      dto,
      req.user.userId,
      req.user.role,
    );
  }
}
