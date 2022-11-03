import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { BadRequestException } from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/users.entity';
import { NotFoundException } from '@nestjs/common/exceptions';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    private accessToken: string;

    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        @InjectRepository(User) private repo: Repository<User>
    ) {}

    createAccessToken(user: User) {
        const payload = { id: user.id, email: user.email, admin: user.admin };
        this.accessToken = this.jwtService.sign(
            payload,
            { expiresIn: '5d' }
        );   

        return this.accessToken;
    }

    createRefreshToken(user: User) {
        const payload = { id: user.id, email: user.email, admin: user.admin };
        if (!user.refreshToken) {
            user.refreshToken = this.jwtService.sign(
                payload,
                { expiresIn: '10y' }
            );
            this.repo.save(user);
        }
        return user.refreshToken;
    }

    async destroyAccessToken() {
        
    }

    async signup(email: string, password: string) {
        const [user] = await this.usersService.find(email);
        if (user) {
            throw new BadRequestException('Email in use');
        }
        password = await bcrypt.hash(password, 10);
        const newUser = this.repo.create({ email, password });
        return this.repo.save(newUser);
    }

    async signin(email: string, password: string) {
        const [user] = await this.usersService.find(email);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            throw new BadRequestException('Invalid password');
        }
        return user;
    }
}
