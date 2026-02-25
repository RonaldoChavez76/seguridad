import { Inject, Injectable } from "@nestjs/common";
import { CreateTaskDto } from "../dto/create-task.dto";
import { Client } from "pg";

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

  public async getTaskById(id: number): Promise<any> {
    const query = 'SELECT * FROM task WHERE id = $1'; 
    const result = await this.db.query(query, [id]); 
    
    return result.rows[0];
}

  public async insertTask(task: CreateTaskDto): Promise<any> {
    const query = 'INSERT INTO task (name, description, priority, user_id) VALUES ($1, $2, $3, $4) RETURNING *';
    const result = await this.db.query(query, [task.name, task.description, task.priority, task.user_id]);
    return result.rows[0];
  }

  public async updateTask(id: number, task: any): Promise<any> {
    const query = 'UPDATE task SET name = $1, description = $2, priority = $3 WHERE id = $4 RETURNING *';
    const result = await this.db.query(query, [task.name, task.description, task.priority, id]);
    return result.rows[0];
  }

  public async deleteTask(id: number): Promise<any> {
    const query = 'DELETE FROM task WHERE id = $1 RETURNING *';
    const result = await this.db.query(query, [id]);
    return result.rows[0];
  }
}