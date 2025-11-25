import {
    Controller,
    Post,
    Delete,
    Get,
    Body,
    Put,
    Query,
    Req
} from '@nestjs/common';
import { RolesEnum, StatusPostulationEnum } from 'src/enums/enums.enum';
import { PostulationsEgresadoVacancyService } from './postulations-egresado-vacancy.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { NotificationsService } from '../notifications/notifications.service';
import { EgresadosService } from '../egresados/egresados.service';

@Controller('postulations-vacancy')
export class PostulationsEgresadoVacancyController {
    constructor(
        private readonly postulationsService: PostulationsEgresadoVacancyService,
        private readonly notificationsService: NotificationsService,
        private readonly egresadosService: EgresadosService,
    ) { }


    @Post('postulate-vacancy')
    @Roles(RolesEnum.EGRERSADO)
    async create(
        @Req() req: any, @Query() query: { idVacancy: number }) {
        const { userData } = req
        const result = await this.postulationsService.create(query.idVacancy, userData.egresado.id);

        if (result) {
            await this.notificationsService.saveNotification({
                company: userData.egresado.id,
                title: 'Nueva postulación',
                description: `El egresado ${userData.egresado.name} ha postulado a tu vacante`,
                extras: JSON.stringify([{
                    "ID Vacante": query.idVacancy,
                    "ID Empresa": result.vacancy.company.id,
                    "Empresa": result.vacancy.company.name,
                    "Egresado": userData.egresado.name,
                    "Egresado Id": userData.egresado.id
                }]),
            })

            return result
        }
    }


    @Delete('remove-postulation')
    deletePostulation(@Query() query: { id: number }) {
        return this.postulationsService.deletePostulation(query.id);
    }


    @Put('change-status')
    async updateStatus(
        @Body() body: { idVacancy: number, status: StatusPostulationEnum, idEgresado: number, motiveReject?: string },
    ) {

        // const result = await this.postulationsService.updateStatus(body.idVacancy, body.status);
        const result = await this.postulationsService.updateStatus(body.idVacancy, StatusPostulationEnum.POSTULADO);
        if (result) {

            const egresado = await this.egresadosService.findOneById(body.idEgresado)

            if (egresado) {
                await this.notificationsService.saveNotification({
                    egresado: egresado,
                    title: 'Nueva estado de postulación',
                    description: `Tu postulacion ha cambiado a ${body.status}`,
                    extras: JSON.stringify([{
                        "ID Vacante": body.idVacancy,
                        "ID Empresa": result.vacancy.company.id,
                        "Empresa": result.vacancy.company.name,
                    }]),
                })
            }

        }
        return result
    }


    @Get('vacancy-postulations')
    findByVacancy(@Query() query: { idVacancy: number }) {
        return this.postulationsService.findByVacancy(query.idVacancy);
    }


    @Get('egresado-postulations')
    @Roles(RolesEnum.EGRERSADO)
    findByEgresado(@Req() req: any, @Query() query: { idVacancy: number }) {
        if (query.idVacancy) {
            return this.postulationsService.findByEgresado(query.idVacancy);
        }

        const { userData } = req
        return this.postulationsService.findByEgresado(userData.egresado.id);
    }


    @Get('detail-postulation')
    findOne(@Query() query: { id: number }) {
        return this.postulationsService.findOne(query.id);
    }


    @Get('egresado-is-postulated')
    @Roles(RolesEnum.EGRERSADO)
    isPostulated(@Req() req: any, @Query() query: { idVacancy: number, egresadoId?: number }) {

        if (query.egresadoId)
            return this.postulationsService.findByEgresado(query.egresadoId);
        const { userData } = req

        return this.postulationsService.isPostulated(query.idVacancy, userData.egresado.id);
    }
}
