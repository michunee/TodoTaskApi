import { IsBoolean } from 'class-validator';

export class ChangeStatusDto {
  @IsBoolean()
  completed: boolean;
}
