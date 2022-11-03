import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './tasks.entity';
import { CreateTaskDto } from './dtos/create-task.dto';
import { User } from 'src/users/users.entity';
import { ChangeStatusDto } from './dtos/change-status.dto';
import { ChangeContentDto } from './dtos/change-content.dto';

@Injectable()
export class TasksService {
    constructor(@InjectRepository(Task) private repo: Repository<Task>) {}

    find(user: User) {
        const tasks = this.repo.find({ where: { user }, relations: ['user'] });
        return tasks;
    }

    create(body: CreateTaskDto, user: User) {
        const task = this.repo.create(body);
        task.user = user;
        return this.repo.save(task);
    }

    async changeStatus(body: ChangeStatusDto, user: User, id: number) {
        const task = await this.repo.findOne({ where: { id, user }, relations: ['user'] });
        if (!task) {
            throw new NotFoundException('Task not found');
        }
        task.completed = body.completed;
        return this.repo.save(task);
    }

    async changeContent(body: ChangeContentDto, user: User, id: number) {
        const task = await this.repo.findOne({ where: { id, user }, relations: ['user'] });
        if (!task) {
            throw new NotFoundException('Task not found');
        }
        Object.assign(task, body);
        return this.repo.save(task);
    }

    async remove(user: User, id: number) {
        const task = await this.repo.findOne({ where: { id, user }, relations: ['user'] });
        if (!task) {
            throw new NotFoundException('Task not found');
        }
        return this.repo.remove(task);
    }
}
