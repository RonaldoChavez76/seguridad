import { Injectable } from "@nestjs/common";

@Injectable()
export class TaskService {
  public getTasks(): string[] {
    return ['Task 1', 'Task 2', 'Task 3'];
  }

  public getTaskById(id: number): string {
    return 'Se obtiene la tarea ${id}';
  }
  public insertTask(task: any): any {
    return task;
  }
  public updateTask(id: number, task: any): any {
    return task;
  }
  public deleteTask(id: number): any {
    return 'Eliminando la tarea ' + id;
  }
}