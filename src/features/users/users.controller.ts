import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    findAll(): Promise<User[]> {
        return this.usersService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: number): Promise<User | null> {
        return this.usersService.findOne(id);
    }

    @Post()
    create(@Body() userData: Partial<User>) {
        return this.usersService.create(userData);
    }

    @Put(':id')
    update(@Param('id') id: number, @Body() userData: Partial<User>) {
        return this.usersService.update(id, userData);
    }

    @Delete(':id')
    remove(@Param('id') id: number) {
        return this.usersService.remove(id);
    }
}
