import { IsBoolean } from "class-validator";

export class ChangeRoleDto {
    @IsBoolean()
    admin: boolean;
}