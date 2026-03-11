import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from 'bcrypt';

@Injectable()
export class UtilService {

    constructor(private readonly jwtSvc: JwtService) {}

    public async hashPassword(password: string): Promise<string> {
        const saltRounds = 10;
        return await bcrypt.hash(password, saltRounds);
    }

    public async checkPassword(password: string, encryptedPassword: string): Promise<boolean> {
        return await bcrypt.compare(password, encryptedPassword);
    }

    public async generateJWT(payload: any):Promise<string> {
            return await this.jwtSvc.signAsync(payload, { secret: process.env.JWT_SECRET });
    }

    public async getPayload(token: string):Promise<any> {
           return await this.jwtSvc.verifyAsync(token, { secret: process.env.JWT_SECRET });
    }

}