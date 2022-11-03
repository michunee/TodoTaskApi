import { Expose, Transform } from 'class-transformer';

export class TaskDto {
    @Expose()
    id: string;

    @Expose()
    content: string;

    @Expose()
    completed: boolean;

    @Transform(({ obj }) => obj.user.id)
    @Expose()
    userId: string;
}