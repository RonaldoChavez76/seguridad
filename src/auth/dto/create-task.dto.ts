import { IsBoolean, IsNotEmpty, isNotEmpty, IsString, Max, MaxLength, Min, MinLength } from "class-validator"

export class CreateTaskDto {

    @IsNotEmpty()
    @IsString()
    @MinLength(3) 
    @MaxLength(50) 
    name: string 

    @IsNotEmpty()
    @IsString()
    @MinLength(3) 
    @MaxLength(50) 
    description: string

    @IsNotEmpty()
    @IsBoolean()
    priority: boolean    
}
