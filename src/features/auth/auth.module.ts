import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/features/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { ValidateFields } from 'src/common/validators/validateFields.validator';
import { RandomUtil } from 'src/common/utils/random.util';
import { EmailService } from 'src/services/emails.service';
import { TokensOtpService } from './tokens-otp/tokens-otp.service';
import { TokenOTP } from './tokens-otp/tokenOtp.entity';
import { RolesService } from '../roles/roles.service';
import { RolesModule } from '../roles/roles.module';
import { CompaniesModule } from '../companies/companies.module';
import { EgresadosSystemService } from 'src/services/integrations/egresados-system.service';
import { EgresadosModule } from '../egresados/egresados.module';

@Module({
  imports: [
    UsersModule,
    RolesModule,
    CompaniesModule,
    PassportModule,
    EgresadosModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
    TypeOrmModule.forFeature([TokenOTP]),

  ],
  providers: [
    AuthService,
    EmailService,
    TokensOtpService,
    TokensOtpService,
    JwtStrategy,
    ValidateFields,
    RandomUtil,
    EgresadosSystemService,
  ],
  controllers: [AuthController],
  exports: []
})
export class AuthModule { }
