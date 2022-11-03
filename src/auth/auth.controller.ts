import { 
    Controller,
    Post,
    Body,
    Response,
    UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('signup')
    async createUser(@Body() body: CreateUserDto) {
        const { email, password } = body;
        const user = await this.authService.signup(email, password);
        return user;
    }

    @Post('signin')
    async signin(@Body() body: CreateUserDto, @Response({passthrough: true}) res: any) {
        const { email, password } = body;
        const user = await this.authService.signin(email, password);
        const accessToken = this.authService.createAccessToken(user);
        res.cookie('access-token', accessToken, { httpOnly: true });
        return { user, accessToken };
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('signout')
    signout(@Response({passthrough: true}) res: any) {
        res.cookie('access-token', null, { httpOnly: true });
        return { message: 'You have been signed out' };
    }
}
