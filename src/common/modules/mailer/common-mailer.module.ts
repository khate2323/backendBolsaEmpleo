import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { ValidateFields } from 'src/common/validators/validateFields.validator';
import { EmailService } from 'src/services/emails.service';
import { RandomUtil } from 'src/common/utils/random.util';
import { EmailController } from 'src/controllers/email/email.controller';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true para 465
        pool: true,
        auth: {
          user: 'dkaterine2601@gmail.com',
          pass: 'dyju zarj kzlb bfup',
        },
      },
      defaults: {
        from: '"Soporte" <no-reply@gmail.com>',
      },
      template: {
        dir: join(__dirname, '..', '..', '..', '..', '/src/templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  providers: [ValidateFields, EmailService, RandomUtil],
  controllers: [EmailController],
})
export class CommonMailerModule { }
