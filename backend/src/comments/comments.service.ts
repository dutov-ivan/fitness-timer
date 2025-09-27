import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  async findOne(id: number) {
    return this.prisma.comment.findUnique({ where: { id } });
  }

  async update(id: number, dto: UpdateCommentDto) {
    return this.prisma.comment.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    return this.prisma.comment.delete({ where: { id } });
  }

  async findByWorkout(workoutId: number) {
    return this.prisma.comment.findMany({ where: { WorkoutId: workoutId } });
  }

  async createForWorkout(workoutId: number, dto: CreateCommentDto) {
    return this.prisma.comment.create({
      data: { ...dto, WorkoutId: workoutId },
    });
  }
}
