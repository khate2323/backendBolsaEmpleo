import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Req,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AuthService } from './auth.service';
import { ValidateFields } from 'src/common/validators/validateFields.validator';
import { EmailService } from 'src/services/emails.service';
import { TokensOtpService } from './tokens-otp/tokens-otp.service';
import { UsersService } from '../users/users.service';
import { RolesService } from '../roles/roles.service';
import { RolesEnum, StatusCompanyEnum } from 'src/enums/enums.enum';
import { CompaniesService } from '../companies/companies.service';
import { EgresadosSystemService } from 'src/services/integrations/egresados-system.service';
import { UserIntCreate } from 'src/interfaces/user.interface';
import { EgresadosService } from '../egresados/egresados.service';
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly validateFields: ValidateFields,
    private readonly emailService: EmailService,
    private readonly tokensOtpService: TokensOtpService,
    private readonly rolesService: RolesService,
    private readonly companiesService: CompaniesService,
    private readonly dataSource: DataSource,
    private readonly egresadosSystemService: EgresadosSystemService,
    private readonly egresadosService: EgresadosService,
  ) {}

  @Post('register')
  async register(@Body() body: any) {
    if (!body)
      throw new BadRequestException(
        "Todos los campos son requeridos: ['name', 'email', 'password']",
      );

    this.validateFields.validateFieldsMetodo(body, [
      'name',
      'email',
      'password',
    ]);
    this.validateFields.isEmail(body.email);

    const roleFound = await this.rolesService.findByRoleName(RolesEnum.COMPANY);
    if (!roleFound) throw new NotFoundException('El rol no existe');

    body.role = roleFound;

    return await this.dataSource.transaction(async (manager) => {
      const newUser = await this.authService.register(body, manager);

      if (newUser) {
        if (roleFound.nombre === RolesEnum.COMPANY) {
          this.validateFields.validateFieldsMetodo(body, [
            'nit',
            'phone',
            'direction',
          ]);
          const newCompany = await this.companiesService.create(
            {
              name: body.name,
              status: 'Nuevo',
              nit: body.nit,
              email: body.email,
              phone: body.phone,
              webSite: body.webSite,
              direction: body.direction,
              user: newUser,
            },
            manager,
          );

          await this.usersService.update(
            newUser.id,
            { company: newCompany },
            manager,
          );
          newUser.company = newCompany;
        }
        const { password, ...result } = newUser;
        return result;
      } else {
        throw new BadRequestException('El usuario no pudo ser creado');
      }
    });
  }

  @Post('login')
  async login(@Body() data: { email: string; password: string }) {
    try {
      if (!data)
        throw new BadRequestException(
          'Todos los campos son requeridos: [email, password]',
        );
      this.validateFields.validateFieldsMetodo(data, ['email', 'password']);

      const { email, password } = data;
      this.validateFields.isEmail(email);

      let user = await this.authService.validateUser(email, password);

      // Ir a buscar en egresados interopewrabilidad
      if (!user) {
        const roleFound = await this.rolesService.findByRoleName(
          RolesEnum.EGRERSADO,
        );
        if (roleFound) {
          // 🟩 Validar correo con dominio @unimayor.edu.co @khate2323
          if (this.validateFields.isEmailUnimayor(email)) {
            const response =
              await this.egresadosSystemService.getEgresadoByEmailInstitute(
                email,
                password,
              );
            console.log(response, 'response');

            if (response) {
              return await this.dataSource.transaction(async (manager) => {
                const body = {
                  name: response.name,
                  email: response.emailinstitute,
                  password: password,
                  isActive: true,
                  role: roleFound,
                };

                const newUser = await this.authService.register(body, manager);
                const newEgresado = await this.egresadosService.create(
                  { ...response, id_egresado: response.id },
                  manager,
                );
                await this.usersService.update(
                  newUser.id,
                  { egresado: newEgresado },
                  manager,
                );
                await this.egresadosService.update(
                  newEgresado.id,
                  { user: newUser },
                  manager,
                );

                user = newUser;

                // 🟩 Crear token OTP asociado al usuario
                const tokenData = await this.tokensOtpService.createTokenToUser(
                  user,
                  manager,
                );

                // 🟩 Enviar email con el token
                await this.emailService.sendCodeVerificationEmail(
                  user.email,
                  user.name,
                  tokenData.token,
                );

                // 🟩 Generar JWT principal
                user.sub = user.id;
                const jwt = this.authService.signJWtToken(user);

                // 🟩 Retornar respuesta
                return {
                  id: user.id,
                  name: user.name,
                  email: user.email,
                  role: user.role,
                  company: user.company,
                  isActive: user.isActive,
                  token: jwt,
                  otpExpiresAt: tokenData.expiredAt,
                };
              });
            }
          } else {
            throw new BadRequestException(
              'El correo no pertenece a la institución',
            );
          }
        }
      }

      if (!user.isActive)
        throw new UnauthorizedException('El usuario no está activo');

      // 🟩 Crear token OTP asociado al usuario
      const tokenData = await this.tokensOtpService.createTokenToUser(user);

      // 🟩 Enviar email con el token
      await this.emailService.sendCodeVerificationEmail(
        user.email,
        user.name,
        tokenData.token,
      );

      // 🟩 Generar JWT principal
      user.sub = user.id;
      const jwt = this.authService.signJWtToken(user);

      // 🟩 Retornar respuesta
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        company: user.company,
        isActive: user.isActive,
        token: jwt,
        otpExpiresAt: tokenData.expiredAt,
      };
    } catch (error) {
      throw error;
    }
  }

  @Post('verify-token-otp')
  async verifyToken(@Body() data: { token: string }, @Req() req: any) {
    try {
      if (!data)
        throw new BadRequestException(
          "Todos los campos son requeridos: ['token']",
        );
      this.validateFields.validateFieldsMetodo(data, ['token']);

      const { token } = data;
      const userId = req.tokenDecoded.payload.sub;

      const user = await this.usersService.findOne(userId);
      if (!user) {
        throw new NotFoundException('El usuario no existe');
      }
      await this.tokensOtpService.useToken(token, user);
      await this.usersService.update(userId, { isSessionActive: true });

      return user;
    } catch (error) {
      throw error;
    }
  }

  @Get('resend-verify-token-otp')
  async resendVerifyToken(@Req() req: any) {
    try {
      const { tokenDecoded } = req;
      const userId = tokenDecoded.payload.sub;

      const user = await this.usersService.findOne(userId);
      if (!user) {
        throw new NotFoundException('El usuario no existe');
      }

      const tokenData = await this.tokensOtpService.createTokenToUser(user);
      await this.emailService.sendCodeVerificationEmail(
        user.email,
        user.name,
        tokenData.token,
      );

      return user;
    } catch (error) {
      throw error;
    }
  }

  @Post('logout')
  async logout(@Req() req: any) {
    try {
      const userId = req.tokenDecoded.payload.sub;
      const result = await this.usersService.update(userId, {
        isSessionActive: false,
      });
      return result;
    } catch (error) {
      throw error;
    }
  }

  @Get('check-session')
  async checkSession(@Req() req: any) {
    try {
      const { userData, companyData } = req;
      if (userData.role.nombre === RolesEnum.COMPANY)
        return { ...userData, company: companyData };

      return userData;
    } catch (error) {
      throw error;
    }
  }
}
