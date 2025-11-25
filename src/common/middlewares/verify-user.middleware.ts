import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { NextFunction } from 'express';
import { UsersService } from 'src/features/users/users.service';
import { RolesEnum, StatusCompanyEnum } from 'src/enums/enums.enum';

@Injectable()
export class VerifyUserMiddleware implements NestMiddleware {

  constructor(
    private readonly usersService: UsersService
  ) { }

  async use(req: Request, res: Response, next: NextFunction) {

    const tokenDecoded = req['tokenDecoded'];
    const payload = tokenDecoded.payload;
    const idUser = payload.sub;

    let userFound = await this.usersService.findOne(idUser);

    if (!userFound) { throw new UnauthorizedException('Para realizar esta accion debes estar logueado') }
    if (!userFound.isActive) {
      await this.usersService.update(userFound.id, { isSessionActive: false })
      throw new UnauthorizedException('El usuario no esta activo')
    }

    if (userFound.role.nombre === RolesEnum.COMPANY) {
      const companyFound = userFound.company;
      if (companyFound) {

        let canPublish = false;
        let canRequestVerification = false;

        if (companyFound.status === StatusCompanyEnum.VERIFICADO) {
          canPublish = true
          canRequestVerification = false
        } else {
          if (
            companyFound.ChamberofCommerce &&
            companyFound.rut &&
            companyFound.legalRepresentativeDocument
          ) {
            canRequestVerification = true
          }
        }

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

        req['companyCanPublish'] = canPublish;
        req['companyCanRequestVerification'] = canRequestVerification;
        req['companyData'] = { ...{ ...companyFound, companyDocs }, canPublish, canRequestVerification };
      }
    }
    
    const { password, ...userData } = userFound
    req['userData'] = userData;
    req['userRoleName'] = userData.role.nombre;

    next();
  }
}
