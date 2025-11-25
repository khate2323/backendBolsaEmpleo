import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        // // console.log("context", context);

        // context.getArgs()[0].url
        // console.log(context.getArgs()[0].url);
        
        // // .filter((arg) => {
        // //     if (arg.url === '/companies/info-company') {
        // //         console.log("arg", arg);
        // //         return true;
        // //     }
        // // })

        const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
        if (!requiredRoles) return true;

        const request = context.switchToHttp().getRequest();
        const user = request.userData;

        if (!requiredRoles.includes(user.role.nombre)) {
            throw new ForbiddenException('No tienes permisos para acceder a esta acción');
        }

        return true;
    }
}
