import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { TrainingExercise } from './training-exercise.entity';

@Entity()
export class Training {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => TrainingExercise, (exercise) => exercise.training)
  exercises: TrainingExercise[];

  @ManyToMany(() => User, (user) => user.ownedTrainings)
  owners: User[];

  @ManyToOne(() => User, (user) => user.createdTrainings)
  creator: User;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  shareToken?: string;
}
