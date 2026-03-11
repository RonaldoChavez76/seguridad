import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService : JwtService) {}


  public logIn(): string {
    return 'Sesión exitosa';
  }

  public async signAsync(payload: any, options: any): Promise<string> {
    return this.jwtService.signAsync(payload, options);
  }

}