import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
            const data = request?.cookies['refresh-token'];
            if (!data) {
                return null;
            }
            return data;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: 'my-secret-key',
    });
  }

  async validate(payload: any) {
    const user = await this.usersService.findOne(payload.id);
    if (!user) {
        throw new NotFoundException('User not found');
    }
    return user;
  }
}