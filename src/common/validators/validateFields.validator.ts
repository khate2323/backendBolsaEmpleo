import { BadRequestException, Injectable } from "@nestjs/common";
import { isEmail } from "class-validator";

@Injectable()
export class ValidateFields {
    constructor() { }

    validateFieldsMetodo(body: any, fields: string[]) {
        for (const field of fields) {
            if (!body[field]) {
                throw new BadRequestException(`El campo '${field}' es obligatorio`);
            }
        }
    }

    isEmail(email: string): boolean {
        if (!email) { throw new BadRequestException('El email es requerido') }
        if (!isEmail(email)) { throw new BadRequestException('El email no es valido') }
        return true;
    }
}