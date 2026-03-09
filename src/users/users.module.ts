import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { databaseProvider } from 'src/common/providers/database/database.provide';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, databaseProvider[0], PrismaService],
})
export class UsersModule {}
