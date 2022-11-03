import { IsString } from "class-validator";

export class ChangeContentDto {
    @IsString()
    content: string;
}