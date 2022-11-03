import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
            const data = request?.cookies['access-token'];
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
    return this.usersService.findOne(payload.id);
  }
}