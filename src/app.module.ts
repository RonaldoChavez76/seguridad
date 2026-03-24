import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { databaseProvider } from './common/providers/database/database.provide';
import { PrismaService } from './common/prisma/prisma.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TaskController } from './task/controller/task.controller';
import { TaskService } from './task/service/task.service';
import { AuthGuard } from './common/guards/auth.guard';
import { UtilService } from './common/services/util.service';

@Module({
  imports: [UsersModule, AuthModule],
  controllers: [AppController, TaskController],
  providers: [AppService, TaskService, databaseProvider[0], PrismaService, UtilService],
})
export class AppModule {}
