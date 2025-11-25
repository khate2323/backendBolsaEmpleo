import { Module } from '@nestjs/common';
import { PostulationsEgresadoVacancyController } from './postulations-egresado-vacancy.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostulationsEgresadoVacancy } from './postulationsEgresadoVacancy.entity';
import { PostulationsEgresadoVacancyService } from './postulations-egresado-vacancy.service';
import { VacanciesModule } from '../vacancies/vacancies.module';
import { EgresadosModule } from '../egresados/egresados.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    VacanciesModule, 
    EgresadosModule,  
    NotificationsModule,
    TypeOrmModule.forFeature([PostulationsEgresadoVacancy])
  ],
  providers: [PostulationsEgresadoVacancyService],
  controllers: [PostulationsEgresadoVacancyController]
})
export class PostulationsEgresadoVacancyModule { }
