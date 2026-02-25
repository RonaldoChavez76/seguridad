import { Inject, Injectable } from "@nestjs/common";
import { CreateTaskDto } from "../dto/create-task.dto";
import { Client } from "pg";
import { Task } from "../entities/task.entity";
import { UpdateTaskDto } from "../dto/update-task.dto";

@Injectable()
export class TaskService {

  constructor( 
    @Inject('DATABASE_CONNECTION') private db : Client
  ) {}

  private tasks: any[] = [];

  public async getTasks(): Promise<any[]> {
    const query = 'SELECT * FROM task';
    const result = await this.db.query(query);
    return result.rows;
  }

  public async getTaskById(id: number): Promise<Task> {
    const query = 'SELECT * FROM task WHERE id = $1'; 
    const result = await this.db.query(query, [id]); 
    
    return result.rows[0];
}

  public async insertTask(task: CreateTaskDto): Promise<any> {
    const query = 'INSERT INTO task (name, description, priority, user_id) VALUES ($1, $2, $3, $4) RETURNING *';
    const result = await this.db.query(query, [task.name, task.description, task.priority, task.user_id]);
    return result.rows[0];
  }

  public async updateTask(id: number, updateTaskDto: UpdateTaskDto): Promise<any> {
  const updates = Object.entries(updateTaskDto)
    .filter(([_, value]) => value !== undefined)
    .map(([key, _], index) => `${key} = $${index + 1}`)
    .join(', ');

  if (!updates) return this.getTaskById(id);

  const values = Object.values(updateTaskDto).filter(v => v !== undefined);
  const query = `UPDATE task SET ${updates} WHERE id = $${values.length + 1} RETURNING *`;
  
  const result = await this.db.query(query, [...values, id]);
  return result.rows[0];
}

  public async deleteTask(id: number): Promise<any> {
    const query = 'DELETE FROM task WHERE id = $1 RETURNING *';
    const result = await this.db.query(query, [id]);
    return result.rowCount! > 0;
  }
}