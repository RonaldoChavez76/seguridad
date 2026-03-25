import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation } from '@nestjs/swagger';
import { AuthDto } from './dto/auth.dto';
import { UtilService } from 'src/common/services/util.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { AppException } from 'src/common/exceptions/app.exception';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authSvc: AuthService, private readonly utilSvc: UtilService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verifica las credenciales y genera un JWT' })
  public async logIn(@Body() auth: AuthDto): Promise<any> {
    const { username, password } = auth;

    // Verificar usuario y contraseña en la base de datos
    const user = await this.authSvc.getUserByUsername(username);
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    if (await this.utilSvc.checkPassword(password, user.password!)) {
      // Obtener la informacion a enviar payload
      const { password, ...payload } = user;
     

      //Generar token de actualización por 7 días
      const refreshToken = await this.utilSvc.generateJWT(payload, '7d');
      const hashRT = await this.utilSvc.hash(refreshToken);

      await this.authSvc.updateHash(payload.id, hashRT);

       //  Generar token de aaceso por 1 hora
      payload.hash = hashRT;
      
      const jwt = await this.utilSvc.generateJWT(payload, '1h');

      return await { access_token: jwt, 
        refresh_token: hashRT 
      };

    } else {
      throw new UnauthorizedException('Contraseña incorrecta');
    }
  }

  @Get('me')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Extrae el id del usuario desde el token y busca la información del usuario' })
  public async getProfile(@Req() req: any): Promise<string> {
    const user = req['users'];
    return user;
  }


  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @ApiOperation({summary: 'Genera un nuevo JWT utilizando un token de actualización válido'})
  public async refreshToken(@Req() req: any) {
    //Obtener el usuario en sesion
     const userSession = req['users'];
     const user = await this.authSvc.getUserById(userSession.id);

    console.log(userSession)
    console.log(user)


     if (!user || !user.hash) throw new AppException('Acceso denegado', HttpStatus.FORBIDDEN, '0');
    //Coparar el token recibido con el token guardado
    if (userSession.hash != user.hash) throw new AppException('Token invalido', HttpStatus.FORBIDDEN, '0');
    //Si el token es valido se generan nuevos tokens
    return {
      token: "",
      refresh_token: ""
    }
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({summary: 'Invalida el token de acceso actual y el token de actualización'})
  public async logOut(@Req() req: any) {
    const session = req['users'];
    const user = await this.authSvc.updateHash(session.id, null);
    return user;
  }

}