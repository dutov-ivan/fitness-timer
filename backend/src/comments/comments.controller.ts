import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentsService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCommentDto) {
    return this.commentsService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentsService.remove(+id);
  }

  @Get('/workout/:workoutId')
  findByWorkout(@Param('workoutId') workoutId: string) {
    return this.commentsService.findByWorkout(+workoutId);
  }

  @Post('/workout/:workoutId')
  createForWorkout(
    @Param('workoutId') workoutId: string,
    @Body() dto: CreateCommentDto,
  ) {
    return this.commentsService.createForWorkout(+workoutId, dto);
  }
}
