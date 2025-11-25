import { Body, Controller, Post, BadRequestException } from '@nestjs/common';
import { EmailService } from 'src/services/emails.service';
import { ValidateFields } from 'src/common/validators/validateFields.validator';
import type { RejectVacancyEmailRequest } from 'src/interfaces/email.interface';

@Controller('email')
export class EmailController {
    constructor(
        private readonly emailService: EmailService,
        private readonly validateFields: ValidateFields,
    ) { }

    @Post('send-code-verification')
    async sendCodeVerificationEmail(
        @Body() data: { email: string; name: string; code: string }
    ) {

        try {
            if (!data)
                throw new BadRequestException('Todos los campos son requeridos: [email, name, code]');

            const { email, name, code } = data;

            if (this.validateFields.isEmail(email)) {
                this.validateFields.validateFieldsMetodo(data, ['email', 'name', 'code']);
                await this.emailService.sendCodeVerificationEmail(email, name, code);
            } else {
                throw new BadRequestException('El email es invalido');
            }
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    @Post('send-reject-vacancy')
    async sendRejectVacancyEmail(
        @Body() data: RejectVacancyEmailRequest
    ) {
        try {
            if (!data)
                throw new BadRequestException('Todos los campos son requeridos: [email, name, code]');

            const { to } = data;

            if (this.validateFields.isEmail(to)) {
                this.validateFields.validateFieldsMetodo(data, ['to', 'name', 'title', 'createdAt', 'motive']);
                await this.emailService.sendRejectVacancyEmail(data);
            } else {
                throw new BadRequestException('El email es invalido');
            }
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }
}
