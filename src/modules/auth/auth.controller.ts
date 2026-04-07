import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation } from '@nestjs/swagger';
import { AuthDto } from './dto/auth.dto';
import { UtilService } from 'src/common/services/util.service';
import { AuthGuard } from 'src/common/guards/auth.guard';

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
        // Excluir contraseña y hash del payload del Access Token
        const { password, hash, ...payload } = user; 

        // 1. Generar token de actualización por 7 días
        const refreshToken = await this.utilSvc.generateJWT(payload, '7d');
        
        // 2. Hashear el refresh token para guardarlo seguro en BD
        const hashRT = await this.utilSvc.hash(refreshToken);
        await this.authSvc.updateHash(payload.id, hashRT);

        // 3. Generar token de acceso por 1 hora
        const jwt = await this.utilSvc.generateJWT(payload, '1h');

        // 4. Devolver ambos tokens en crudo al cliente
        return { 
          access_token: jwt, 
          refresh_token: refreshToken 
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
  // Requiere que le manden un refresh_token válido en el Body.
  @ApiOperation({summary: 'Genera nuevos tokens usando un refresh token'})
  public async refreshToken(@Body('refresh_token') refreshToken: string) {
    
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token requerido');
    }

    try {
      // 1. Verificamos que el Refresh Token (el de 7 días) sea válido y extraemos su contenido
      const payload = await this.utilSvc.getPayload(refreshToken); 

      // 2. Buscamos al usuario en la BD para asegurarnos de que sigue existiendo
      const user = await this.authSvc.getUserById(payload.id);
      
      // Si no existe o si no tiene un hash guardado (ej. porque hizo logout)
      if (!user || !user.hash) {
        throw new UnauthorizedException('Acceso denegado');
      }

      // 3. Comparamos el token recibido con el hash que está en la BD
      const isMatch = await this.utilSvc.checkPassword(refreshToken, user.hash);
      
      if (!isMatch) {
        throw new UnauthorizedException('Token inválido o revocado');
      }

      // 4. Si todo es correcto, generamos un nuevo par de tokens
      const { password, hash, ...userPayload } = user; // Limpiamos info sensible

      const newAccessToken = await this.utilSvc.generateJWT(userPayload, '1h');
      const newRefreshToken = await this.utilSvc.generateJWT(userPayload, '7d');
      
      // 5. Guardamos el hash del NUEVO refresh token en la BD
      const newHashRT = await this.utilSvc.hash(newRefreshToken);
      await this.authSvc.updateHash(userPayload.id, newHashRT);

      // 6. Devolvemos los tokens al frontend
      return {
        access_token: newAccessToken,
        refresh_token: newRefreshToken
      };

    } catch (error) {
      // Si getPayload falla (ej. si el refresh token también expiró o fue manipulado)
      throw new UnauthorizedException('Refresh token inválido o expirado. Vuelva a iniciar sesión.');
    }
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard)
  @ApiOperation({summary: 'Invalida el token de acceso actual y el token de actualización'})
  public async logOut(@Req() req: any) {
    const session = req['users'];
    // Invalida el refresh token en la BD
    await this.authSvc.updateHash(session.id, null);
    
    // Retorna vacío
    return; 
  }

}