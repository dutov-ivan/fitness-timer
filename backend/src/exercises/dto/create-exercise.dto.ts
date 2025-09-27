import {
  MuscleGroup,
  ExerciseType,
  ExerciseEquipment,
  ExerciseLevel,
} from '../../../generated/prisma';
import {
  IsEnum,
  IsOptional,
  IsString,
  IsInt,
  IsBoolean,
} from 'class-validator';

export class CreateExerciseDto {
  @IsString()
  exerciseName: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(MuscleGroup)
  primaryTarget: MuscleGroup;

  @IsEnum(ExerciseType)
  @IsOptional()
  exerciseType?: ExerciseType = ExerciseType.STRENGTH;

  @IsEnum(ExerciseEquipment)
  @IsOptional()
  equipment?: ExerciseEquipment = ExerciseEquipment.NONE;

  @IsEnum(ExerciseLevel)
  @IsOptional()
  level?: ExerciseLevel = ExerciseLevel.BEGINNER;

  @IsOptional()
  @IsString()
  instructions?: string;

  @IsOptional()
  @IsBoolean()
  isSystemDefined?: boolean = false;

  @IsOptional()
  @IsInt()
  createdById?: number;
}
