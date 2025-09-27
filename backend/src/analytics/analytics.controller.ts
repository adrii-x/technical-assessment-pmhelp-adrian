import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
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

@Controller('analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Get('practice')
  @Roles('DOCTOR')
  async getPracticeAnalytics(@Request() req: AuthenticatedRequest) {
    return this.analyticsService.getPracticeAnalytics(req.user.userId);
  }

  @Get('system')
  @Roles('ADMIN')
  async getSystemAnalytics() {
    return this.analyticsService.getSystemAnalytics();
  }
}
