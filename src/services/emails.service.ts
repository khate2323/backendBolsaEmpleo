import { BadRequestException, Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { AcceptVacancyEmailRequest, EmailResponseSend, InfoStatusCompanyEmailRequest, RejectVacancyEmailRequest } from 'src/interfaces/email.interface';

@Injectable()
export class EmailService {
    constructor(private readonly mailerService: MailerService) { }

    async sendCodeVerificationEmail(to: string, name: string, code: string): Promise<EmailResponseSend> {
        try {
            const resultEmailSend = await this.mailerService.sendMail({
                to,
                subject: 'Código de verificación Bolsa de empleo Unimayor',
                template: 'code-verification.html',
                context: { NAME: name, CODE: code },
            }) as EmailResponseSend;

            return resultEmailSend

        } catch (error) {
            throw new BadRequestException(error);
        }
    }

    async sendRejectVacancyEmail(data: RejectVacancyEmailRequest): Promise<EmailResponseSend> {
        try {
            const resultEmailSend = await this.mailerService.sendMail({
                to: data.to,
                subject: 'Proceso de Vacante: Bolsa de empleo Unimayor',
                template: 'reject-vacancy.html',
                context: {
                    NAME: data.name,
                    VACANCY_TITLE: data.title,
                    PUBLISHED_DATE: data.createdAt,
                    REJECTION_DESCRIPTION: data.motive
                },
            }) as EmailResponseSend;

            return resultEmailSend

        } catch (error) {
            throw new BadRequestException(error);
        }
    }

    async sendAcceptVacancyEmail(data: AcceptVacancyEmailRequest): Promise<EmailResponseSend> {
        try {
            const resultEmailSend = await this.mailerService.sendMail({
                to: data.to,
                subject: 'Proceso de Vacante: Bolsa de empleo Unimayor',
                template: 'accept-vacancy.html',
                context: {
                    NAME: data.name,
                    VACANCY_TITLE: data.title,
                    PUBLISHED_DATE: data.createdAt,
                },
            }) as EmailResponseSend;

            return resultEmailSend

        } catch (error) {
            throw new BadRequestException(error);
        }
    }

    async sendInfoStatusCompanyEmail(data: InfoStatusCompanyEmailRequest): Promise<EmailResponseSend> {
        try {
            const resultEmailSend = await this.mailerService.sendMail({
                to: data.to,
                subject: 'Proceso de verificación: Bolsa de empleo Unimayor',
                template: 'notify-status-company.html',
                context: {
                    NAME: data.name,
                    NEW_STATUS: data.status,
                },
            }) as EmailResponseSend;

            return resultEmailSend

        } catch (error) {
            throw new BadRequestException(error);
        }
    }
}
// El borracho de los dos carnales