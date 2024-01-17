import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class UserDto {
    @IsNotEmpty()
    @IsString()
    readonly fullName: string;

    @IsOptional()
    @IsNumber()
    readonly age: number;

    @IsNotEmpty()
    @IsString()
    readonly email: string;

    @IsNotEmpty()
    @IsString()
    readonly password: string;
}