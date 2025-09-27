import { IsString, IsNotEmpty, IsDateString } from 'class-validator';

export class UpdateUserSubscriptionDto {
  @IsString()
  @IsNotEmpty()
  tier!: string;

  @IsDateString()
  endDate!: string;
}
