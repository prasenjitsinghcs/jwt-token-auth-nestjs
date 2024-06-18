import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from './dto/user.dto';
import { hash } from 'bcrypt';

@Injectable()
export class UserService {
    constructor(private prismaService: PrismaService) { }

    async create(dto: CreateUserDto) {
        const user = await this.prismaService.user.findUnique({
            where: {
                email: dto.email
            }
        });

        if (user) throw new ConflictException("User already exist with this email");

        const newUser = await this.prismaService.user.create({
            data: {
                ...dto,
                password: await hash(dto.password, 10),
            }
        })

        const { password, ...result } = newUser;
        return result;
    }

    async findByEmail(email: string) {
        return await this.prismaService.user.findUnique({
            where: {
                email
            }
        });
    }

    async findById(id: number) {
        return await this.prismaService.user.findUnique({
            where: {
                id
            }
        });
    }
}
