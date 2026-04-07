import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { databaseProvider } from './common/providers/database/database.provide';
import { PrismaService } from './common/prisma/prisma.service';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { TaskController } from './modules/task/controller/task.controller';
import { TaskService } from './modules/task/service/task.service';
import { UtilService } from './common/services/util.service';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';

@Module({
  imports: [UsersModule, AuthModule],
  controllers: [AppController, TaskController],
  providers: [AppService, TaskService, databaseProvider[0], PrismaService, UtilService,
   {provide: APP_FILTER, useClass: AllExceptionsFilter}],
})
export class AppModule {}
