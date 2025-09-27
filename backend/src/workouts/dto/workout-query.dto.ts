import { IsOptional, IsString, IsEnum, IsInt } from 'class-validator';

export enum WorkoutQueryType {
  CREATED = 'created',
  SAVED = 'saved',
  COMPLETED = 'completed',
}

export class WorkoutQueryDto {
  @IsOptional()
  @IsEnum(WorkoutQueryType)
  type?: WorkoutQueryType;

  @IsOptional()
  @IsInt()
  userId?: number;

  @IsOptional()
  @IsString()
  q?: string;

  @IsOptional()
  @IsString()
  muscle?: string;

  @IsOptional()
  @IsString()
  level?: string;
}
