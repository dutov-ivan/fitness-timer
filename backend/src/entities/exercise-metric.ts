import { Column } from 'typeorm';
import { MetricType } from './exercise-data';

export class ExerciseMetric {
  @Column({ type: 'enum', enum: MetricType })
  type: MetricType;

  @Column({ type: 'float' })
  value: number;

  @Column({ nullable: true })
  unit?: string; // Optional unit for the metric
}
