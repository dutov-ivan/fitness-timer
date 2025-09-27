import { PartialType } from '@nestjs/mapped-types';
import { CreateSessionExerciseDto } from './create-session-exercise.dto';

export class UpdateSessionExerciseDto extends PartialType(
  CreateSessionExerciseDto,
) {}
