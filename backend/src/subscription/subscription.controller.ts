import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { SubscriptionsService } from './subscription.service';
import { UpgradeSubscriptionDto } from './dto/upgrade-subscription.dto';
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

@Controller('subscriptions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SubscriptionsController {
  constructor(private subscriptionsService: SubscriptionsService) {}

  @Get('plans')
  @Roles('PATIENT', 'ADMIN')
  async getAvailablePlans() {
    return this.subscriptionsService.getAvailableSubscriptions();
  }

  @Get('my')
  @Roles('PATIENT')
  async getMySubscription(@Request() req: AuthenticatedRequest) {
    return this.subscriptionsService.getUserSubscription(req.user.userId);
  }

  @Get('usage')
  @Roles('PATIENT')
  async getMyUsage(@Request() req: AuthenticatedRequest) {
    return this.subscriptionsService.getSubscriptionUsage(req.user.userId);
  }

  @Post('upgrade')
  @Roles('PATIENT')
  async upgradeSubscription(
    @Body() dto: UpgradeSubscriptionDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.subscriptionsService.upgradeSubscription(req.user.userId, dto);
  }

  @Delete('cancel')
  @Roles('PATIENT')
  async cancelSubscription(@Request() req: AuthenticatedRequest) {
    return this.subscriptionsService.cancelSubscription(req.user.userId);
  }
}
