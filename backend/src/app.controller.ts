// backend/src/app.controller.ts
import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('root')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @ApiOperation({ summary: 'API root / health check' })
  @ApiResponse({ status: 200, description: 'Service is healthy.' })
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
