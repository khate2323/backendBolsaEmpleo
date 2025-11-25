import { Module } from '@nestjs/common';
import { VacanciesService } from './vacancies.service';
import { VacanciesController } from './vacancies.controller';
import { Vacancy } from './vacancy.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ValidateFields } from 'src/common/validators/validateFields.validator';
import { EmailService } from 'src/services/emails.service';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    NotificationsModule,
    TypeOrmModule.forFeature([Vacancy])
  ],
  controllers: [VacanciesController],
  providers: [VacanciesService, ValidateFields, EmailService],
  exports: [VacanciesService, TypeOrmModule]
})
export class VacanciesModule { }
