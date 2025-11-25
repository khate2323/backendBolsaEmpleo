import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RolesService } from './roles.service';

@Controller('roles')
export class RolesController {
    constructor(private readonly rolesService: RolesService) { }

    @Get()
    findAll() {
        return this.rolesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.rolesService.findOne(id);
    }

    @Post()
    create(@Body() body: any) {
        return this.rolesService.create(body);
    }
}
