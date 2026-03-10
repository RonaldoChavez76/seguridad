import { Injectable } from "@nestjs/common";
import * as bcrypt from 'bcrypt';

@Injectable()
export class UtilService {

    public async hashPassword(password: string): Promise<string> {
        const saltRounds = 10;
        return await bcrypt.hash(password, saltRounds);
    }

    public async checkPassword(password: string, encryptedPassword: string): Promise<boolean> {
        return await bcrypt.compare(password, encryptedPassword);
    }

}