import { Body, Controller, Get, Put, Query, Req } from '@nestjs/common';
import { EgresadosService } from './egresados.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesEnum } from 'src/enums/enums.enum';

@Controller('egresados')
export class EgresadosController {
    constructor(
        private readonly egresadosService: EgresadosService
    ) { }

    @Get('all')
    @Roles(RolesEnum.ADMIN)
    async getEgresados() {
        return this.egresadosService.findAll()
    }

    @Put('update')
    @Roles(RolesEnum.ADMIN, RolesEnum.EGRERSADO)
    async update(@Query() query: { id: number }, @Body() body: { status?: string, canPostulate?: boolean, phone?: string, municipality?: string, emailpersonal?: string }) {
        console.log(body);

        await this.egresadosService.update(query.id, body)
    }

    @Get('profile')
    @Roles(RolesEnum.EGRERSADO)
    async profile(@Req() req: any, @Query() query: { idEgresado: number }) {
        const { userData } = req


        const cvResponse = await this.egresadosService.findOneById(userData.egresado.id)
        console.log(cvResponse, 'cvResponse');
    }
}
