// src/appointments/dto/create-appointment.dto.ts
import {
  IsNotEmpty,
  IsInt,
  IsDateString,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateAppointmentDto {
  @IsInt()
  @IsNotEmpty()
  doctorId!: number;

  @IsInt()
  @IsNotEmpty()
  availabilityId!: number;

  @IsDateString()
  date!: string;

  @IsOptional()
  @IsString()
  reason?: string;
}
