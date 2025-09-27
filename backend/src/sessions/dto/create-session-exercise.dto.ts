import {
  IsInt,
  IsOptional,
  IsNumber,
  IsString,
  IsBoolean,
} from 'class-validator';

export class CreateSessionExerciseDto {
  @IsInt()
  order: number;

  @IsOptional()
  @IsNumber()
  actualMetricValue?: number;

  @IsOptional()
  @IsString()
  actualMetricUnit?: string;

  @IsOptional()
  @IsBoolean()
  completed?: boolean = false;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsInt()
  sessionId: number;

  @IsInt()
  WorkoutExerciseId: number;
}
