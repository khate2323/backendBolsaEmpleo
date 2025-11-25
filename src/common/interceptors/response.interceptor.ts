import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable, map, catchError, throwError } from 'rxjs';
import { QueryFailedError } from 'typeorm';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => ({
        status: true,
        statusCode:
          context.switchToHttp().getResponse().statusCode || HttpStatus.OK,
        message: 'success',
        results: data ?? [],
      })),
      catchError((error) => {
        console.trace(error.message, "trace");

        console.error('🔥 Error capturado por interceptor:', error);

        let statusCode =
          error?.status ||
          error?.statusCode ||
          HttpStatus.BAD_REQUEST;
        let description = error.message || 'Error interno';

        // 🧩 Detecta errores de base de datos de TypeORM
        if (error instanceof QueryFailedError) {
          const pgError: any = error;

          switch (pgError.code) {
            case '23505': // unique_violation
              statusCode = HttpStatus.CONFLICT;
              description =
                'Ya existe un registro con el mismo valor único. ' +
                (pgError.detail || '');
              break;

            case '23503': // foreign_key_violation
              statusCode = HttpStatus.BAD_REQUEST;
              description =
                'Violación de llave foránea. Revisa los datos relacionados. ' +
                (pgError.detail || '');
              break;

            case '23502': // not_null_violation
              statusCode = HttpStatus.BAD_REQUEST;
              description =
                'Falta un campo requerido. ' + (pgError.column || '');
              break;

            case '22P02': // no_enum_valid
              statusCode = HttpStatus.BAD_REQUEST;
              description =
                'la sintaxis de entrada no es válida para un enumerado.';
              break;

            default:
              statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
              description = pgError.message || 'Error en la base de datos.';
              break;
          }
        }

        if (error.message == 'ServiceUnavailableException: TypeError: fetch failed') {
          statusCode = HttpStatus.SERVICE_UNAVAILABLE;
          description = 'Servicio no disponible';
        }

        return throwError(
          () =>
            new HttpException(
              {
                status: false,
                message: 'error',
                statusCode,
                description,
                results: [],
              },
              statusCode,
            ),
        );
      }),
    );
  }
}
