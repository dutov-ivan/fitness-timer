import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ExerciseDefinition } from './exercise-definition.entity';
import { Training } from './training.entity';
import { ExerciseMetric } from './exercise-metric';

@Entity()
export class TrainingExercise {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Training, (training) => training.exercises)
  training: Training;

  @ManyToOne(() => ExerciseDefinition, (exercise) => exercise.id)
  exerciseDefinition: ExerciseDefinition;

  @Column(() => ExerciseMetric)
  exerciseMetric: ExerciseMetric;

  @Column()
  order: number;
}
