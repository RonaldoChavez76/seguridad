import { Inject, Injectable } from "@nestjs/common";
import { CreateTaskDto } from "../dto/create-task.dto";
import { Client } from "pg";
import { Task } from "../entities/task.entity";
import { UpdateTaskDto } from "../dto/update-task.dto";
import { PrismaService } from "src/common/prisma/prisma.service";

@Injectable()
export class TaskService {

  constructor( 
    @Inject('DATABASE_CONNECTION') private db : Client,
    private prisma : PrismaService
  ) {}

  public async getTasks(id: number): Promise<Task[]> {
  return await this.prisma.task.findMany({
    where: {
      user_id: id
    }
  })
}

public async getTaskById(id: number, userId: number): Promise<Task | null> {
  try {
    return await this.prisma.task.findUniqueOrThrow({
      where: { id, user_id: userId }
    });
  } catch (error) {
    return null;
  }
}

public async insertTask(task: CreateTaskDto): Promise<Task> {
  return await this.prisma.task.create({
    data: task
  });
}

public async updateTask(id: number, userId: number, taskUpdated: UpdateTaskDto): Promise<Task> {
  return await this.prisma.task.update({
    where: { id, user_id: userId },
    data: taskUpdated
  });
}

public async deleteTask(id: number, userId: number): Promise<boolean> {
  await this.prisma.task.delete({
    where: { id, user_id: userId }
  });
  return true;
}

}