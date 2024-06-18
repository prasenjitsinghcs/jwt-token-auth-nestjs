import { IsEmail, IsNotEmpty, IsString } from "class-validator"

export class AuthDto {
    @IsNotEmpty()
    @IsEmail()
    username: string;

    @IsString()
    password: string;
}