import {
  Controller,
  Get,
  Body,
  Post,
  Param,
  Delete,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dtos/create-task.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { TaskDto } from './dtos/tasks.dto';
import { ChangeStatusDto } from './dtos/change-status.dto';
import { ChangeContentDto } from './dtos/change-content.dto';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { User } from 'src/users/users.entity';

@Controller('tasks')
@UseGuards(AuthGuard('jwt'))
@Serialize(TaskDto)
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  async getTasks(@CurrentUser() user: User) {
    const tasks = await this.tasksService.find(user);
    return tasks;
  }

  @Post()
  createTask(@Body() body: CreateTaskDto, @CurrentUser() user: User) {
    return this.tasksService.create(body, user);
  }

  @Patch('completed/:id')
  changeStatus(
    @Param('id') id: string,
    @Body() body: ChangeStatusDto,
    @CurrentUser() user: User,
  ) {
    return this.tasksService.changeStatus(body, user, parseInt(id));
  }

  @Patch('content/:id')
  changeContent(
    @Param('id') id: string,
    @Body() body: ChangeContentDto,
    @CurrentUser() user: User,
  ) {
    return this.tasksService.changeContent(body, user, parseInt(id));
  }

  @Delete(':id')
  deleteTask(@Param('id') id: string, @CurrentUser() user: User) {
    return this.tasksService.remove(user, parseInt(id));
  }
}
