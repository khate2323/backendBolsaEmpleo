import { BadRequestException, Body, Controller, ForbiddenException, Get, Logger, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { VacanciesService } from './vacancies.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import type { VacancieCreateInt } from 'src/interfaces/vacancie.interface';
import { ValidateFields } from 'src/common/validators/validateFields.validator';
import { RolesEnum, StatusCurriculumGraduateEnum, StatusVacancyEnum } from 'src/enums/enums.enum';
import { EmailService } from 'src/services/emails.service';
import { NotificationsService } from '../notifications/notifications.service';

@Controller('vacancies')
@UseGuards(RolesGuard)
export class VacanciesController {
    constructor(
        private readonly vacanciesService: VacanciesService,
        private readonly validateFields: ValidateFields,
        private readonly emailService: EmailService,
        private readonly notificationService: NotificationsService,
    ) { }

    @Post('create')
    @Roles('empresa', 'admin')
    async create(@Req() req: any, @Body() body: VacancieCreateInt) {
        const { companyCanPublish, userData } = req
        if (!companyCanPublish) throw new ForbiddenException('La empresa no puede publicar vacantes, debe ser verificada por el administrador')

        const fieldsRequired = [
            'title', 'laborSector', 'cantVacancies', 'salary', 'description',
            'modality', 'typeContract', 'workingDay', 'levelEducation', 'experienceRequired',
            'dateExpires', 'departament', 'municipality', 'faculty', 'program', 'disability',
            'typeDisability', 'aditionalRequirements', 'keywords'
        ]
        if (!body) throw new BadRequestException(`Todos los campos son requeridos: ${fieldsRequired.join(', ')}`);
        this.validateFields.validateFieldsMetodo(body, fieldsRequired);

        body.company = userData.company

        const result = await this.vacanciesService.createVacancy(body);
        return result
    }

    @Get('all')
    @Roles(RolesEnum.ADMIN, RolesEnum.EGRERSADO)
    async findAll() {
        return await this.vacanciesService.findAll();
    }

    @Get('one-by-id')
    async findOneById(@Query() query: { id: number }) {
        if (!query.id) throw new BadRequestException('Todos los campos son requeridos: [id]');
        const response = await this.vacanciesService.findOneById(query.id);
        if (!response) throw new BadRequestException('La vacante no existe');
        return response
    }

    @Get('all-by-status')
    async findAllByStatus(@Query() query: { status: StatusCurriculumGraduateEnum, companyId?: number, faculty?: string, keywords?: string[] }) {
        if (!query.status) throw new BadRequestException('Todos los campos son requeridos: [status]');
        return await this.vacanciesService.findAllByStatus(query);
    }

    @Get('all-company')
    @Roles(RolesEnum.COMPANY)
    async findAllCompany(@Req() req: any) {
        const { userData } = req
        return await this.vacanciesService.findAllByCompany(userData.company.id);
    }

    @Get('all-by-company-id')
    async findAllByCompanyId(@Query() query: { idCompany: number }) {
        if (!query.idCompany) throw new BadRequestException('Todos los campos son requeridos: [idCompany]');
        return await this.vacanciesService.findAllByCompany(query.idCompany);
    }

    @Put('change-status')
    @Roles(RolesEnum.ADMIN)
    async changeStatus(@Body() body: { id: number, newStatus: StatusVacancyEnum, motive: string }, @Req() req: any) {
        if (!body.id || !body.newStatus) throw new BadRequestException('Todos los campos son requeridos: [id, newStatus]');
        const vacancyFound = await this.vacanciesService.findOneById(body.id);
        if (!vacancyFound) throw new BadRequestException('La vacante no existe');

        const result = await this.vacanciesService.changeStatus(body.id, body.newStatus);

        switch (body.newStatus) {
            case StatusVacancyEnum.ACEPTADA:
                await this.notificationService.saveNotification({
                    title: "Vacante aceptada",
                    description: `La vacante "${vacancyFound.title}" publicada por la empresa ${vacancyFound.company.name} fue aceptada.`,
                    company: vacancyFound.company,
                    extras: JSON.stringify([{ id: vacancyFound.id, Vacante: vacancyFound.title, Empresa: vacancyFound.company.name, "Aceptado por": req.userData.name }]),
                })

                await this.emailService.sendAcceptVacancyEmail({
                    to: vacancyFound.company.email,
                    name: vacancyFound.company.name,
                    title: vacancyFound.title,
                    createdAt: `${vacancyFound.createdAt}`,
                })
                break

            case StatusVacancyEnum.RECHAZADA:
                await this.notificationService.saveNotification({
                    title: "Vacante rechazada",
                    description: `La vacante "${vacancyFound.title}" publicada por la empresa ${vacancyFound.company.name} fue rechazada.`,
                    company: vacancyFound.company,
                    extras: JSON.stringify([{ id: vacancyFound.id, Vacante: vacancyFound.title, Empresa: vacancyFound.company.name, Motivo: body.motive || "No especificado" }]),
                })

                await this.emailService.sendRejectVacancyEmail({
                    to: vacancyFound.company.email,
                    name: vacancyFound.company.name,
                    title: vacancyFound.title,
                    createdAt: `${vacancyFound.createdAt}`,
                    motive: body.motive
                })
                break
        }

        return result
    }
}
