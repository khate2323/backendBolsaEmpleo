import { BadRequestException, Body, Controller, Get, NotFoundException, Post, Put, Query, Req } from '@nestjs/common';
import { GraduateCurriculumService } from './graduate-curriculum.service';
import { GraduateCurriculum } from './graduateCurriculum.entity';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesEnum } from 'src/enums/enums.enum';
import { DataSource } from 'typeorm';
import { ValidateFields } from 'src/common/validators/validateFields.validator';

@Controller('graduate-curriculum')
export class GraduateCurriculumController {
    constructor(
        private readonly graduateCurriculumService: GraduateCurriculumService,
        private readonly dataSource: DataSource,
        private readonly validateFields: ValidateFields,

    ) { }

    @Post('create-initial')
    @Roles(RolesEnum.EGRERSADO)
    async create(@Req() req: any, @Body() body: any) {
        const { userData } = req
        if (!body) throw new BadRequestException('Todos los campos son requeridos');
        const dataToSave = { ...body, egresado: userData.egresado }

        return await this.dataSource.transaction(async (manager) => {
            return await this.graduateCurriculumService.create(dataToSave, manager);
        })
    }

    @Get('get-one-by-id')
    async findOneById(@Query() query: { id: number }) {
        if (!query.id) throw new BadRequestException('Todos los campos son requeridos');
        return await this.graduateCurriculumService.findOneById(query.id);
    }

    @Get('get-by-egresado')
    @Roles(RolesEnum.EGRERSADO)
    async findByEgresado(@Req() req: any) {
        const { userData } = req        
        const id = userData.egresado.id;
        const response = await this.graduateCurriculumService.findOneByIdEgresadoId(id);
        if (!response) throw new NotFoundException('El egresado no tiene curriculum creado');
        return response
    }

    @Put('update')
    @Roles(RolesEnum.EGRERSADO)
    async update(@Req() req: any, @Body() data: { id: number, data: Partial<GraduateCurriculum> }) {
        
        if (!data) throw new BadRequestException('Todos los campos son requeridos');
        this.validateFields.validateFieldsMetodo(data, ['id']);

        return await this.dataSource.transaction(async (manager) => {
            return await this.graduateCurriculumService.update(data.id, data, manager);
        })
    }
}
