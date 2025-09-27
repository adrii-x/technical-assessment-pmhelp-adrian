import { IsNotEmpty, IsInt, IsString, IsOptional } from 'class-validator';

export class CreateMedicalRecordDto {
  @IsInt()
  @IsNotEmpty()
  patientId!: number;

  @IsString()
  @IsNotEmpty()
  details!: string;

  @IsOptional()
  @IsString()
  diagnosis?: string;

  @IsOptional()
  @IsString()
  treatment?: string;
}
