import { Injectable } from "@nestjs/common";
import { CreateTaskDto } from "../dto/create-task.dto";

@Injectable()
export class TaskService {

  private tasks: any[] = [];

  public getTasks(): any[] {
    return this.tasks;
  }

  public getTaskById(id: number): any {
    var task = this.tasks.filter((data) => data.id === id);
    return task;
  }

  public insertTask(task: CreateTaskDto): any {
    var id = this.tasks.length + 1;
    var position =this.tasks.push({ id, ...task });
    return this.tasks[position - 1];
  }

  public updateTask(id: number, task: any): any {
    const taskUpdated = this.tasks.find((data) => {
      if (data.id === id) {
          if(task.name) data.name = task.name;
          if(task.description) data.description = task.description; 
          if(task.priority != null) data.priority = task.priority;

          return data;
      }
    });
    return taskUpdated;
  }

  public deleteTask(id: number): any {
    const array = this.tasks.filter((data) => data.id !== id);
    this.tasks = array;
    return `Task deleted`;
  }
}