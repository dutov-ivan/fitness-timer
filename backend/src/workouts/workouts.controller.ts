import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { WorkoutsService } from './workouts.service';
import { CreateWorkoutDto } from './dto/create-workout.dto';
import { UpdateWorkoutDto } from './dto/update-workout.dto';
import { WorkoutQueryDto } from './dto/workout-query.dto';

@Controller('workouts')
export class WorkoutsController {
  constructor(private readonly workoutsService: WorkoutsService) {}

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  findAll(@Query() query: WorkoutQueryDto) {
    return this.workoutsService.findAll(query);
  }

  @Post()
  create(@Body() dto: CreateWorkoutDto) {
    return this.workoutsService.create(dto);
  }

  @Get('feed')
  feed() {
    return this.workoutsService.feed();
  }

  @Get('search')
  @UsePipes(new ValidationPipe({ transform: true }))
  search(@Query() query: WorkoutQueryDto) {
    return this.workoutsService.search(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.workoutsService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateWorkoutDto) {
    return this.workoutsService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.workoutsService.remove(+id);
  }

  @Post(':id/save')
  save(@Param('id') id: string, @Body('userId') userId: number) {
    return this.workoutsService.saveWorkout(+id, userId);
  }

  @Delete(':id/save')
  unsave(@Param('id') id: string, @Body('userId') userId: number) {
    return this.workoutsService.unsaveWorkout(+id, userId);
  }

  @Post(':id/like')
  like(@Param('id') id: string, @Body('userId') userId: number) {
    return this.workoutsService.likeWorkout(+id, userId);
  }

  @Delete(':id/like')
  unlike(@Param('id') id: string, @Body('userId') userId: number) {
    return this.workoutsService.unlikeWorkout(+id, userId);
  }
}
