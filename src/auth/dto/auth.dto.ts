import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class AuthDto {

    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    @MaxLength(100)
    username: string;
    
    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    @MaxLength(100)
    password: string;
}   