import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';

@Injectable()
export class ExercisesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.exerciseDefinition.findMany();
  }

  async create(dto: CreateExerciseDto) {
    return this.prisma.exerciseDefinition.create({ data: dto });
  }

  async findOne(id: number) {
    return this.prisma.exerciseDefinition.findUnique({ where: { id } });
  }

  async update(id: number, dto: UpdateExerciseDto) {
    return this.prisma.exerciseDefinition.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    return this.prisma.exerciseDefinition.delete({ where: { id } });
  }
}
