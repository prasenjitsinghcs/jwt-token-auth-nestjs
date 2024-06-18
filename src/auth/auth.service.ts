import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { AuthDto } from './dto/auth.dto';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private userService: UserService, private jwtService: JwtService) { }

    private tokeExpiry = '1h';
    private refreshTokenExpriy = '5h';

    async login(dto: AuthDto) {
        const user = await this.validateUser(dto);

        const payload = {
            username: user.email,
            sub: {
                name: user.name
            }
        }

        return {
            user,
            ... await this.generateToken(payload)
        }
    }

    async validateUser(dto: AuthDto) {
        const user = await this.userService.findByEmail(dto.username);

        if (user && (await compare(dto.password, user.password))) {
            const { password, ...result } = user;
            return result;
        }

        throw new UnauthorizedException();
    }

    async refreshToken(user: any) {
        const payload = {
            username: user.username,
            sub: user.sub
        }

        return await this.generateToken(payload);
    }

    private async generateToken(payload: any) {
        return {
            accessToken: await this.jwtService.signAsync(payload, {
                expiresIn: this.tokeExpiry,
                secret: process.env.JWT_ACCESS_TOKEN_KEY
            }),
            refreshToken: await this.jwtService.signAsync(payload, {
                expiresIn: this.refreshTokenExpriy,
                secret: process.env.JWT_REFRESH_TOKEN_KEY
            })
        }
    }
}
