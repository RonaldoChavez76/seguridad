import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { databaseProvider } from './common/providers/database/database.provide';
import { PrismaService } from './common/prisma/prisma.service';
import { UsersModule } from './users/users.module';
import { UsersService } from './users/users.service';
import { UsersController } from './users/users.controller';
import { TaskController } from './task/controller/task.controller';
import { TaskService } from './task/service/task.service';

@Module({
  imports: [UsersModule],
  controllers: [AppController, TaskController, UsersController],
  providers: [AppService, TaskService, databaseProvider[0], PrismaService, UsersService],
})
export class AppModule {}
