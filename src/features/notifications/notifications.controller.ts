import { BadRequestException, Body, Controller, Get, Inject, Post, Put, Query, Req } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { RolesEnum, StatusNotificationEnum } from 'src/enums/enums.enum';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('notifications')
export class NotificationsController {
    constructor(
        private readonly notificationsService: NotificationsService
    ) { }

    @Post('save')
    async saveNotificatin(@Body() body: any, @Req() req: any) {
        if (!body) throw new BadRequestException(`Todos los campos son requeridos: ['title', 'description']`);
        const { userRoleName, userData, companyData } = req
        if (userRoleName === RolesEnum.COMPANY)
            body.company = companyData

        if (userRoleName === RolesEnum.EGRERSADO)
            body.user = userData

        return await this.notificationsService.saveNotification(body);
    }

    @Get('all')
    @Roles(RolesEnum.ADMIN)
    async getAll() {
        return await this.notificationsService.findAll();
    }

    @Get('all-company')
    @Roles(RolesEnum.COMPANY)
    async getAllByCompany(@Req() req: any) {
        const { companyData } = req
        return await this.notificationsService.findAllByCompanyId(companyData.id);
    }

    @Get('all-egresado')
    @Roles(RolesEnum.EGRERSADO)
    async findAllByEgresadoId(@Req() req: any) {
        const { userData } = req
        console.log(userData);
        
        return await this.notificationsService.findAllByEgresadoId(userData.egresado.id);
    }

    @Get('all-user')
    @Roles(RolesEnum.ADMIN, RolesEnum.EGRERSADO)
    async getAllByUser(@Req() req: any) {
        const { userData } = req
        return await this.notificationsService.findAllByUserId(userData.id);
    }

    @Get('one-by-id')
    async getOneById(@Query() query: { id: number }) {
        if (!query.id) throw new BadRequestException('Todos los campos son requeridos: [id]');
        return await this.notificationsService.findOneById(query.id);
    }

    @Put('change-status')
    async changeStatus(@Query() query: { id: number, newStatus: StatusNotificationEnum }) {
        if (!query.id || !query.newStatus) throw new BadRequestException('Todos los campos son requeridos: [id, newStatus]');
        return await this.notificationsService.changeStatus(query.id, query.newStatus);
    }
}
