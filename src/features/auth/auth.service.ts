import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/features/users/users.service';
import { JwtInt } from 'src/interfaces/auth.interface';
import { UserIntCreate } from 'src/interfaces/user.interface';
import { EntityManager } from 'typeorm';
import { User } from '../users/user.entity';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.usersService.findByEmail(email);
        if (user && (await bcrypt.compare(password, user.password))) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    signJWtToken(user: JwtInt) {
        try {
            const payload = { email: user.email, sub: user.sub };
            const token = this.jwtService.sign(payload, {
                secret: process.env.JWT_SECRET,
                expiresIn: '1d',
                algorithm: 'HS256'
            })
            return token
        } catch (error) {
            throw new Error(error);
        }
    }

    async register(userData: UserIntCreate, manager?: EntityManager): Promise<User> {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const newUser = await this.usersService.create({
            ...userData,
            password: hashedPassword,

        }, manager);
        return newUser
    }


}
