import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { BadRequestException } from '@nestjs/common/exceptions';
import { ChangeRoleDto } from './dtos/change-role.dto';
import { ChangePasswordDto } from './dtos/change-password.dto';
const bcrypt = require('bcrypt');


@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private repo: Repository<User>) {}

    async create(email: string, password: string) {
        const [user] = await this.repo.find({email});
        if (user) {
            throw new BadRequestException('Email in use');
        }
        password = await bcrypt.hash(password, 10);
        const newUser = this.repo.create({ email, password });
        newUser.admin = true;
        return this.repo.save(newUser);
    }

    find(email: string) {
        if (!email) {
            return this.repo.find();
        }
        return this.repo.find({ email });
    }

    findOne(id: number) {
        if (!id) {
            throw new BadRequestException('User not found');
        }
        return this.repo.findOne({ id });
    }

    async remove(id: number) {
        const user = await this.repo.findOne(id);
        if (!user) {
            throw new BadRequestException('User not found');
        }
        return this.repo.remove(user);
    }

    async changeRole(id: number, body: ChangeRoleDto) {
        const user = await this.repo.findOne(id);
        if (!user) {
            throw new BadRequestException('User not found');
        }
        user.admin = body.admin;
        return this.repo.save(user);
    }

    async changePassword(body: ChangePasswordDto, user: User) {
        user.password = await bcrypt.hash(body.password, 10);
        return this.repo.save(user);
    }
}
