import { Module } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CompaniesController } from './companies.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './company.entity';
import { ValidateFields } from 'src/common/validators/validateFields.validator';
import { NotificationsModule } from '../notifications/notifications.module';
import { UsersModule } from '../users/users.module';
import { EmailService } from 'src/services/emails.service';

@Module({
  imports: [
    NotificationsModule,
    UsersModule,
    TypeOrmModule.forFeature([Company])
  ],
  providers: [CompaniesService, ValidateFields, EmailService],
  controllers: [CompaniesController],
  exports: [CompaniesService],
})
export class CompaniesModule { }
