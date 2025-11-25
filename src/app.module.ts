
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './features/auth/auth.module';
import { UsersModule } from './features/users/users.module';
import { RolesModule } from './features/roles/roles.module';
import { CompaniesModule } from './features/companies/companies.module';
import { VacanciesModule } from './features/vacancies/vacancies.module';
import { EgresadosModule } from './features/egresados/egresados.module';
import { NotificationsModule } from './features/notifications/notifications.module';
import { AuthMiddleware } from './common/middlewares/auth.middleware';
import { CommonMailerModule } from './common/modules/mailer/common-mailer.module';
import { VerifyUserMiddleware } from './common/middlewares/verify-user.middleware';
import { FirebaseModule } from './common/modules/firebase/firebase.module';
import { EgresadosSystemService } from './services/integrations/egresados-system.service';
import { GraduateCurriculumModule } from './features/graduate-curriculum/graduate-curriculum.module';
import { PostulationsEgresadoVacancyModule } from './features/postulations-vacancy/postulations-egresado-vacancy.module';
import { AdminService } from './features/admin/admin.service';
import { AdminController } from './features/admin/admin.controller';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: 5432,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true, //solo debe ser usado en local     
    }),
    
    // TypeOrmModule.forRoot({
    //   type: 'postgres',
    //   url: process.env.DB_HOST,
    //   autoLoadEntities: true,
    //   synchronize: false, // desactivar en producción
    //   ssl: true,
    //   extra: {
    //     ssl: {
    //       rejectUnauthorized: false, // necesario para Neon
    //     },
    //   },
    // }),
    

    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
    AuthModule,
    UsersModule,
    RolesModule,
    CompaniesModule,
    VacanciesModule,
    EgresadosModule,
    NotificationsModule,
    CommonMailerModule,
    FirebaseModule,
    GraduateCurriculumModule,
    PostulationsEgresadoVacancyModule,
  ],
  controllers: [AdminController],
  providers: [EgresadosSystemService, AdminService],
  exports: [TypeOrmModule]
})
export class AppModule implements NestModule {

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: 'auth/login', method: RequestMethod.ALL },
        { path: 'auth/register', method: RequestMethod.ALL }
      )
      .forRoutes('*')
    consumer
      .apply(VerifyUserMiddleware)
      .exclude(
        // { path: 'companies/info-company', method: RequestMethod.GET },
        { path: 'auth/login', method: RequestMethod.ALL },
        { path: 'auth/register', method: RequestMethod.ALL }
      )
      .forRoutes('*');
  }

}
