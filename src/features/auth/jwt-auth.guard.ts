import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor() {
        super();
    }

    handleRequest(err, user, info) {
       console.log(err);
       console.log(user);
       console.log(info);
       
        if (err || !user) {
            throw new UnauthorizedException('Unauthorized');
        }
        return user;
    }
}
