import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSessionExerciseDto } from './dto/create-session-exercise.dto';
import { UpdateSessionExerciseDto } from './dto/update-session-exercise.dto';

@Injectable()
export class SessionsService {
  constructor(private prisma: PrismaService) {}

  async findOne(id: number) {
    return this.prisma.workoutSessionExercise.findUnique({ where: { id } });
  }

  async create(dto: CreateSessionExerciseDto) {
    return this.prisma.workoutSessionExercise.create({ data: dto });
  }

  async update(id: number, dto: UpdateSessionExerciseDto) {
    return this.prisma.workoutSessionExercise.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number) {
    return this.prisma.workoutSessionExercise.delete({ where: { id } });
  }
}
