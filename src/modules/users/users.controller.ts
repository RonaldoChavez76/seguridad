import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Patch, Post, Put, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiOperation } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entity/user.entity';
import { UtilService } from 'src/common/services/util.service';
import { AuthGuard } from 'src/common/guards/auth.guard';

@Controller('api/users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService, private readonly utilService: UtilService) {}

 @Get()
@ApiOperation({ summary: 'Obtener todos los usuarios disponibles' })
public async fetchUsers(@Req() request: any): Promise<any[]> {
    const { id } = request['users'];
    if (!id || typeof id !== 'number') {
        throw new UnauthorizedException;
    }
    
    return await this.usersService.getUsers(id);
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
      const encryptedPassword = await this.utilService.hash(user.password);
      user.password = encryptedPassword;
      return await this.usersService.insertUser(user);
    } catch (error) {
      // 1. Verificamos si es el código específico de Prisma para un "Unique Constraint Failed"
      if ((error as any).code === 'P2002') {
        throw new HttpException(
          'El nombre de usuario ya está registrado. Por favor, elige otro.', 
          HttpStatus.CONFLICT
        );
      }

      // 2. (Opcional pero recomendado) Si el error YA ES una excepción de NestJS, lo dejamos pasar tal cual
      if (error instanceof HttpException) {
        throw error;
      }

      // 3. Si es un error desconocido de la base de datos o el servidor, mostramos el genérico
      throw new HttpException('Error al crear el usuario', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch(':id')
  public async updateUser(@Param("id", ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    try {
      // Si enviaron contraseña, la encriptamos. Si no, la eliminamos del objeto para no sobreescribir con vacío
      if (updateUserDto.password && updateUserDto.password.trim() !== '') {
        const encryptedPassword = await this.utilService.hash(updateUserDto.password);
        updateUserDto.password = encryptedPassword;
      } else {
        delete updateUserDto.password;
      }

      return await this.usersService.updateUser(id, updateUserDto);
    } catch (error) {
      // 1. Verificamos si intentó poner un username que ya existe
      if ((error as any).code === 'P2002') {
        throw new HttpException(
          'El nombre de usuario ya está registrado. Por favor, elige otro.', 
          HttpStatus.CONFLICT
        );
      }

      // 2. Verificamos si Prisma nos dice que el usuario a actualizar NO existe
      if ((error as any).code === 'P2025') {
        throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
      }

      // 3. Si el error ya es una excepción controlada, la dejamos pasar
      if (error instanceof HttpException) {
        throw error;
      }

      // 4. Si es otro error raro, lanzamos un error 500 genérico
      throw new HttpException('Error al actualizar el usuario', HttpStatus.INTERNAL_SERVER_ERROR);
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
