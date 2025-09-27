// src/app.module.ts
import { Module } from '@nestjs/common';
import * as ConfigModule from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { AppointmentsModule } from './appointment/appointment.module';
import { MedicalRecordsModule } from './medical-records/medical-records.module';
import { SubscriptionsModule } from './subscription/subscription.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { UsersModule } from './User/user.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    AppointmentsModule,
    MedicalRecordsModule,
    SubscriptionsModule,
    AnalyticsModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
