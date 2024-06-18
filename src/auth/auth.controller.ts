import { Body, Controller, Post, UseGuards, ValidationPipe, Request } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/user.dto';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { JwtRefreshGuard } from './guards/refresh.guard';

@Controller('auth')
export class AuthController {
    constructor(private userService: UserService, private authService: AuthService) { }

    @Post('register')
    async register(@Body(ValidationPipe) dto: CreateUserDto) {
        return await this.userService.create(dto);
    }

    @Post('login')
    async login(@Body(ValidationPipe) authDto: AuthDto) {
        return await this.authService.login(authDto);
    }

    @UseGuards(JwtRefreshGuard)
    @Post('refresh')
    async refreshToken(@Request() req) {
        return await this.authService.refreshToken(req.user);
    }
}
