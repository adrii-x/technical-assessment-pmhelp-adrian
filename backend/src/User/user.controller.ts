import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { UsersService } from './user.service';
import { UpdateUserSubscriptionDto } from './dto/update-user-subscription.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @Roles('ADMIN')
  async findAll(@Query('page') page = '1', @Query('limit') limit = '10') {
    return this.usersService.findAll(parseInt(page), parseInt(limit));
  }

  @Get(':id')
  @Roles('ADMIN')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getUserById(id);
  }

  @Post(':id/subscription')
  @Roles('ADMIN')
  async updateUserSubscription(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserSubscriptionDto,
  ) {
    return this.usersService.updateUserSubscription(id, dto);
  }
}
