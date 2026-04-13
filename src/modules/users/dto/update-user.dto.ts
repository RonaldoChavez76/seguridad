import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { CreateUserDto } from "./create-user.dto";

export class UpdateUserDto{
        @IsOptional()
        @IsString({ message: 'El nombre debe ser una cadena de texto' })
        @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
        @MaxLength(50, { message: 'El nombre no puede tener más de 50 caracteres' })
        name: string;
        
        @IsOptional()
        @IsString({ message: 'El apellido debe ser una cadena de texto' })
        @MinLength(3, { message: 'El apellido debe tener al menos 3 caracteres' })
        @MaxLength(50, { message: 'El apellido no puede tener más de 50 caracteres' })
        lastname: string;
    
        @IsOptional()
        @IsString({ message: 'El nombre de usuario debe ser una cadena de texto' })
        @MinLength(3, { message: 'El nombre de usuario debe tener al menos 3 caracteres' })
        @MaxLength(50, { message: 'El nombre de usuario no puede tener más de 50 caracteres' })
        username: string;
    
        @IsOptional()
        @IsString({ message: 'La contraseña debe ser una cadena de texto' })
        @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
        @MaxLength(100, { message: 'La contraseña no puede tener más de 100 caracteres' })
        password?: string;
}