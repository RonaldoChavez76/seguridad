import { Inject, Injectable } from '@nestjs/common';
import { Client } from 'pg';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { User } from './entity/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {

    constructor(
        @Inject('DATABASE_CONNECTION') private db : Client,
        private prisma : PrismaService
    ){}

    public async getUsers(): Promise<User[]> {
        return await this.prisma.user.findMany();
    }

    public async getUserById(id: number): Promise<User> {
        try {
            return await this.prisma.user.findUniqueOrThrow({
                where: { id }
            });
        } catch (error) {
            throw new Error('Usuario no encontrado');
        }
    }

    public async insertUser(user: CreateUserDto): Promise<User> {
        return await this.prisma.user.create({
            data: user
        });
    }

    public async updateUser(id: number, userUpdated: UpdateUserDto): Promise<User> {
        return await this.prisma.user.update({
            where: { id },
            data: userUpdated
        });
    }

    public async deleteUser(id: number): Promise<boolean> {
        await this.prisma.user.delete({
            where: { id }
        });
        return true;
    }

}