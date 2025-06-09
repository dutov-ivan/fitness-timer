import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { MuscleGroup } from './exercise-data';

@Entity()
export class ExerciseDefinition {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  exerciseName: string;

  @Column()
  primaryTarget: MuscleGroup;
}
