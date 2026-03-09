import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiOperation } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los usuarios disponibles' })
  public async fetchUsers(): Promise<any[]> {
    try {
      return await this.usersService.getUsers();
    } catch (error) {
      throw new HttpException('Error fetching users', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(":id")
  public async getUserById(@Param("id", ParseIntPipe) id: number): Promise<any> {
    try {
      const user = await this.usersService.getUserById(id);
      if (user) {
        return user;
      } else {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
  }

  @Post()
  public async insertUser(@Body() user: CreateUserDto): Promise<any> {
    try {
      return await this.usersService.insertUser(user);
    } catch (error) {
      throw new HttpException('Error creating user', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put(':id')
  public async updateUser(@Param("id", ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto): Promise<any> {
    try {
      return await this.usersService.updateUser(id, updateUserDto);
    } catch (error) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    } 
  }

  @Delete(':id')
  public async deleteUser(@Param("id", ParseIntPipe) id: number): Promise<any> {
    try {
      return await this.usersService.deleteUser(id);
    } catch (error) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
  }

}
