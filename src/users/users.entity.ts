import { 
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany
} from 'typeorm';
import { Task } from 'src/tasks/tasks.entity'; 

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column({ default: false })
    admin: boolean;

    @Column({ default: null })
    refreshToken: string;

    @OneToMany(type => Task, task => task.user)
    tasks: Task[];
}