import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  public logIn(): string {
    return 'Sesión exitosa';
  }



  public signAsync(payload: any, options: any): Promise<string> {
    return Promise.resolve('JWT');
  }
}