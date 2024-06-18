import { Controller, Get, NotFoundException, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) { }

    @UseGuards(JwtGuard)
    @Get(":id")
    async getUserProfile(@Param("id", ParseIntPipe) id: number) {
        const user = await this.userService.findById(id);

        if (!user) throw new NotFoundException();

        const { password, ...result } = user;

        return result;
    }
}
