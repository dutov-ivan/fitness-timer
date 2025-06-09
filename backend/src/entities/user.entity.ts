import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Training } from './training.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @ManyToMany(() => Training, (training) => training.owners)
  ownedTrainings: Training[];

  @OneToMany(() => Training, (training) => training.creator)
  createdTrainings: Training[];
}
