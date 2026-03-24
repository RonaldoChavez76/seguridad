import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, ParseIntPipe, Post, Put, Req, UseGuards } from '@nestjs/common';
import { TaskService } from '../service/task.service'
import { UpdateTaskDto } from '../dto/update-task.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateTaskDto } from '../dto/create-task.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { User } from '@prisma/client';

@ApiTags('task')
@Controller('api/task')
@UseGuards(AuthGuard)
export class TaskController {
  constructor(private readonly taskSvc: TaskService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todas las tareas disponibles' })
  public async fetchTasks(@Req() request : any) : Promise<any[]> {
    const user = request['users'] as User;
    return await this.taskSvc.getTasks(user.id);

  }

  @Get(":id")
  public async getTaskById(@Req() request: any, @Param("id", ParseIntPipe) id: number): Promise<any> {
    try {
      const user = request['users'] as User;
      const task = await this.taskSvc.getTaskById(id, user.id);
      if (task) {
        return task;
      } else {
        throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
    }
  }

  @Post()
  public async insertTask(@Req() request: any, @Body() task: CreateTaskDto): Promise<any> {
    try {
      const user = request['users'] as User;
      task.user_id = user.id;
      return await this.taskSvc.insertTask(task);
    } catch (error) {
      throw new HttpException('Error creating task', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put(':id')
  public async updateTask(@Req() request: any, @Param("id", ParseIntPipe) id: number, @Body() updateTaskDto: UpdateTaskDto): Promise<any> {
    try {
      const user = request['users'] as User;
      return await this.taskSvc.updateTask(id, user.id, updateTaskDto);
    } catch (error) {
      throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
    }
  }

  @Delete(':id') 
  @HttpCode(HttpStatus.OK)
  public async deleteTask(@Req() request: any, @Param("id", ParseIntPipe) id: number): Promise<boolean> {
    try {
      const user = request['users'] as User;
      await this.taskSvc.deleteTask(id, user.id);
      return true;
    } catch (error) {
      throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
    }
  }
}
