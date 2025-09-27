import { IsString, IsOptional, IsBoolean, IsInt } from 'class-validator';

export class CreateWorkoutDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  shareToken?: string;

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean = false;

  @IsInt()
  creatorId: number;
}
