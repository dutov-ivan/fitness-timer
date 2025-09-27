import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

import { CreateWorkoutDto } from './dto/create-workout.dto';
import { UpdateWorkoutDto } from './dto/update-workout.dto';
import { WorkoutQueryDto, WorkoutQueryType } from './dto/workout-query.dto';

@Injectable()
export class WorkoutsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: WorkoutQueryDto) {
    if (query.type === WorkoutQueryType.CREATED && query.userId) {
      return this.prisma.workout.findMany({
        where: { creatorId: query.userId },
      });
    }
    if (query.type === WorkoutQueryType.SAVED && query.userId) {
      return this.prisma.workoutSaved.findMany({
        where: { userId: query.userId },
        include: { Workout: true },
      });
    }
    if (query.type === WorkoutQueryType.COMPLETED && query.userId) {
      return this.prisma.workoutSession.findMany({
        where: { userId: query.userId, status: 'COMPLETED' },
        include: { Workout: true },
      });
    }
    return this.prisma.workout.findMany();
  }

  async create(dto: CreateWorkoutDto) {
    return this.prisma.workout.create({ data: dto });
  }

  async feed() {
    return this.prisma.workout.findMany({ where: { isPublic: true } });
  }

  async search(query: WorkoutQueryDto) {
    const where: any = { isPublic: true };
    if (query.q) {
      where.OR = [
        { name: { contains: query.q, mode: 'insensitive' } },
        { description: { contains: query.q, mode: 'insensitive' } },
      ];
    }
    if (query.muscle) {
      where.exercises = {
        some: {
          exerciseDefinition: { primaryTarget: query.muscle },
        },
      };
    }
    if (query.level) {
      where.exercises = {
        some: {
          exerciseDefinition: { level: query.level },
        },
      };
    }
    return this.prisma.workout.findMany({ where });
  }

  async findOne(id: number) {
    return this.prisma.workout.findUnique({ where: { id } });
  }

  async update(id: number, dto: UpdateWorkoutDto) {
    return this.prisma.workout.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    return this.prisma.workout.delete({ where: { id } });
  }

  async saveWorkout(workoutId: number, userId: number) {
    return this.prisma.workoutSaved.create({
      data: { WorkoutId: workoutId, userId },
    });
  }

  async unsaveWorkout(workoutId: number, userId: number) {
    return this.prisma.workoutSaved.delete({
      where: { userId_WorkoutId: { userId, WorkoutId: workoutId } },
    });
  }

  async likeWorkout(workoutId: number, userId: number) {
    return this.prisma.like.create({ data: { WorkoutId: workoutId, userId } });
  }

  async unlikeWorkout(workoutId: number, userId: number) {
    return this.prisma.like.delete({
      where: { userId_WorkoutId: { userId, WorkoutId: workoutId } },
    });
  }
}
