import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation } from '@nestjs/swagger';
import { AuthDto } from './dto/auth.dto';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly jwtSvc: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verifica las credenciales y genera un JWT' }) 
  public logIn(@Body() auth: AuthDto): string {
    const { username, password } = auth;

    const jwt = this.jwtSvc.signAsync(auth, {secret: process.env.JWT_SECRET});

    // Verificar usuario y contraseña

    // Obtener la informacion a enviar payload del token

    // Generar el token JWT por 60 segundos

    // Generar refresh token JWT por 7 días


    return this.jwtSvc.logIn();
  }

  @Get('me')
  @ApiOperation({ summary: 'Extrae el id del usuario desde el token y busca la información del usuario' })
  public async getProfile(): Promise<string> {
    return 'Perfil del usuario';
  }


  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({summary: 'Genera un nuevo JWT utilizando un token de actualización válido'})
  public async refresh(): Promise<string> {
    return 'Token actualizado';
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({summary: 'Invalida el token de acceso actual y el token de actualización'})
  public async logOut(): Promise<string> {
    return 'Sesión cerrada';
  }

}