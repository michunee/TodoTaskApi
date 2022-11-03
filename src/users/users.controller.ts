import { 
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    Patch,
    Query,
    UseGuards,
    Request
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { BadRequestException } from '@nestjs/common/exceptions';
import { ChangeRoleDto } from './dtos/change-role.dto';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from 'src/guards/admin.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './users.entity';

@Controller('users')
@UseGuards(AuthGuard('jwt'))
@Serialize(UserDto)
export class UsersController {
    constructor(private usersService: UsersService) {}
    
    @Get('whoami')
    whoAmI(@Request() req: any) {
        return req.user;
    }

    @Get()
    getUser(@Query('email') email: string) {
        return this.usersService.find(email);
    }

    @UseGuards(AdminGuard)
    @Post('admin')
    createAdmin(@Body() body: CreateUserDto) {
        const { email, password } = body;

        return this.usersService.create(email, password);
    }

    @UseGuards(AdminGuard)
    @Patch('admin/role/:id')
    changeRole(@Param('id') id: string, @Body() body: ChangeRoleDto, @CurrentUser() user: User) {
        if (user.id === parseInt(id)) {
            throw new BadRequestException('Cannot change your own role');
        }
        return this.usersService.changeRole(parseInt(id), body);
    }

    @Patch('password')
    changePassword(@Body() body: ChangePasswordDto, @CurrentUser() user: User) {
        return this.usersService.changePassword(body, user);
    }

    @UseGuards(AdminGuard)
    @Delete('admin/:id')
    removeUser(@Param('id') id: string, @CurrentUser() user: User) {
        if (user.id === parseInt(id)) {
            throw new BadRequestException('Cannot delete yourself');
        }
        return this.usersService.remove(parseInt(id));
    }
}
