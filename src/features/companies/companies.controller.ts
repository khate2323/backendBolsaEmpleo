import { BadRequestException, Body, Controller, Get, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { RolesEnum, StatusCompanyEnum } from 'src/enums/enums.enum';
import { ValidateFields } from 'src/common/validators/validateFields.validator';
import { NotificationsService } from '../notifications/notifications.service';
import { UsersService } from '../users/users.service';
import { EmailService } from 'src/services/emails.service';

@Controller('companies')
@UseGuards(RolesGuard)
export class CompaniesController {
    constructor(
        private readonly companiesService: CompaniesService,
        private readonly usersService: UsersService,
        private readonly notificationService: NotificationsService,
        private readonly validateFields: ValidateFields,
        private readonly emailService: EmailService,
    ) { }


    @Put('update-info')
    @Roles(RolesEnum.COMPANY)
    async updateInfoCompany(@Body() data: any, @Req() req: any) {
        if (!data) throw new BadRequestException("Todos los campos son requeridos: ['name', 'legalRepresentativeName', 'companyType', 'email']");
        this.validateFields.validateFieldsMetodo(data, ["name", "legalRepresentativeName", "companyType", "email"]);

        if (data.email) this.validateFields.isEmail(data.email);
        const { companyData } = req

        const companyFound = await this.companiesService.findOne(companyData.id);
        if (!companyFound) throw new BadRequestException('La empresa no existe');

        return await this.companiesService.update(companyData.id, data);
    }

    @Put('request-verification')
    @Roles(RolesEnum.COMPANY)
    async requestVerification(@Req() req: any) {
        const { companyData } = req
        const result = await this.companiesService.update(companyData.id, {
            status: StatusCompanyEnum.VERIFICACIO_SOLICITADA
        });

        const adminUsers = await this.usersService.findAllByRoleName(RolesEnum.ADMIN)

        if (adminUsers.length > 0) {
            for (const admin of adminUsers) {
                let extrasAux = [
                    {
                        id: companyData.id,
                        Nombre: companyData.name,
                    }
                ]
                const dataToSaveNotify = {
                    title: "Solicitud de verificacion",
                    user: admin,
                    company: companyData,
                    description: "La empresa " + companyData.name + " solicito verificacion",
                    extras: JSON.stringify(extrasAux),
                }
                await this.notificationService.saveNotification(dataToSaveNotify)
            }
        }

        return result
    }

    @Put('update-info-id')
    @Roles(RolesEnum.ADMIN, RolesEnum.COMPANY)
    async updateInfoCompanyId(@Body() data: any, @Query() query: { idCompany: number }) {
        if (!query.idCompany) throw new BadRequestException('Todos los campos son requeridos: [idCompany]')
        if (!data) throw new BadRequestException("Todos los campos son requeridos: ['name', 'legalRepresentativeName', 'companyType', 'email', 'rut']");
        this.validateFields.validateFieldsMetodo(data, ["name", "legalRepresentativeName", "companyType", "email", "rut"]);

        if (data.email) this.validateFields.isEmail(data.email);

        const companyFound = await this.companiesService.findOne(query.idCompany);
        if (!companyFound) throw new BadRequestException('La empresa no existe');

        return await this.companiesService.update(query.idCompany, data);
    }

    @Put('update-document')
    @Roles(RolesEnum.COMPANY)
    async updateDocumentsCompany(@Body() data: any, @Req() req: any) {
        if (!data) throw new BadRequestException("Todos los campos son requeridos: ['nameProperty', 'valueProperty']");
        this.validateFields.validateFieldsMetodo(data, ["nameProperty", "valueProperty"]);
        const { companyData } = req
        const filesPermitted = [
            'ChamberofCommerce',
            'logo',
            'certificateofExistence',
            'legalRepresentativeDocument',
            'bankCertification',
            'rut',
        ]

        if (!filesPermitted.includes(data.nameProperty)) throw new BadRequestException('El campo nameProperty no es permitido');
        const dataToUpdate = { [data.nameProperty]: data.valueProperty };

        return await this.companiesService.update(companyData.id, dataToUpdate);
    }

    @Put('change-status')
    @Roles(RolesEnum.ADMIN)
    async changeStatusCompany(@Body() data: { idCompany: number, newStatus: StatusCompanyEnum }, @Req() req: any) {
        if (!data) throw new BadRequestException('Todos los campos son requeridos: [idCompany, newStatus]');
        this.validateFields.validateFieldsMetodo(data, ['idCompany', 'newStatus']);
        const { idCompany, newStatus } = data;
        const companyFound = await this.companiesService.findOne(idCompany);
        if (!companyFound) throw new BadRequestException('La empresa no existe');

        const dataToSaveNotify: any = {
            title: "Cambio de estado",
            company: companyFound,
            user: req.userData,
            description: "",
            extras: [
                {
                    "Id empresa": companyFound.id,
                    "Nombre Empresa": companyFound.name,
                }
            ],
        }

        switch (newStatus) {
            case StatusCompanyEnum.VERIFICADO:
                dataToSaveNotify.description = "La empresa fue verificada";
                dataToSaveNotify.extras.push({
                    "Id": req.userData.id,
                    "Verificado por": req.userData.name,
                });
                await this.emailService.sendInfoStatusCompanyEmail({ to: req.userData.email, name: req.userData.name, status: StatusCompanyEnum.VERIFICADO });
                break;
            case StatusCompanyEnum.VERIFICACIO_SOLICITADA:
                dataToSaveNotify.description = "La empresa solicito verificacion";
                break;
            case StatusCompanyEnum.EN_PROCESO_VERIFICACION:
                dataToSaveNotify.description = "La empresa esta en proceso de verificacion";
                break;
            case StatusCompanyEnum.INACTIVA:
                dataToSaveNotify.description = "La empresa fue inactivada";
                dataToSaveNotify.extras.push({
                    "Id": req.userData.id,
                    "Inactivada por": req.userData.name,
                });
                await this.emailService.sendInfoStatusCompanyEmail({ to: req.userData.email, name: req.userData.name, status: StatusCompanyEnum.INACTIVA });
                break;
            case StatusCompanyEnum.RECHAZADO:
                dataToSaveNotify.description = "La empresa fue rechazada";
                dataToSaveNotify.extras.push({
                    "Id": req.userData.id,
                    "Rechazada por": req.userData.name,
                });
                await this.emailService.sendInfoStatusCompanyEmail({ to: req.userData.email, name: req.userData.name, status: StatusCompanyEnum.RECHAZADO });
                break;

        }

        await this.notificationService.saveNotification(dataToSaveNotify)
        return this.companiesService.changeStatusCompany(idCompany, newStatus as StatusCompanyEnum);
    }

    @Get('info-company-id')
    async getInfoCompanyById(@Req() req: any, @Query() query: { idCompany: number }) {

        if (!query) throw new BadRequestException('Todos los campos son requeridos: [idCompany]');
        this.validateFields.validateFieldsMetodo(query, ['idCompany']);
        const { idCompany } = query;

        const companyFound = await this.companiesService.findOne(idCompany);
        if (!companyFound) throw new BadRequestException('La empresa no existe');

        const companyDocs = [
            {
                label: 'Camara de comercio',
                nameProperty: 'ChamberofCommerce',
                value: companyFound.ChamberofCommerce || ""
            },
            {
                label: 'Rut',
                nameProperty: 'rut',
                value: companyFound.rut || ""
            },
            {
                label: 'Documento representante legal',
                nameProperty: 'legalRepresentativeDocument',
                value: companyFound.legalRepresentativeDocument || ""
            },

        ]

        return { ...companyFound, companyDocs };
    }

    @Get('info-company')
    @Roles(RolesEnum.COMPANY)
    async getInfoCompany(@Req() req: any) {
        const { companyData } = req
        return companyData;
    }

    @Get('all')
    @Roles('admin')
    async getAllCompany(@Query() query: { status: StatusCompanyEnum }) {
        const companyData = await this.companiesService.findAll({ status: query.status });
        return companyData;
    }
}
