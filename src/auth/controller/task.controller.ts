import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { TaskService } from '../service/task.service'

@Controller('api/task')
export class TaskController {
  constructor(private readonly taskSvc: TaskService) {}

  @Get()
  public async fetchTasks(): Promise<any[]> {
    return await this.taskSvc.getTasks();
  }

  @Get(":id")
  public async getTaskById(@Param("id", ParseIntPipe) id: number): Promise<any> {
    const task = await this.taskSvc.getTaskById(id);

    if (task) {
      return task;
    } else {
      throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
    }
  }

 @Post()
  public async insertTask(@Body() task: any): Promise<any> {
    return await this.taskSvc.insertTask(task);
  }

  @Put(':id') 
  public async updateTask(@Param("id", ParseIntPipe) id: number, @Body() task: any): Promise<any> {
    return await this.taskSvc.updateTask(id, task);
  }

  @Delete(':id') 
  public async deleteTask(@Param("id", ParseIntPipe) id: number): Promise<any> {
    return await this.taskSvc.deleteTask(id);
  }
}
