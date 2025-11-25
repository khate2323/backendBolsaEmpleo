import { BadGatewayException, BadRequestException, Injectable, ServiceUnavailableException } from '@nestjs/common';
import { supabase } from '../integrations/supabaseClient';
import { Egresado } from 'src/features/egresados/egresado.entinty';
import * as bcrypt from 'bcrypt';
import { log } from 'node:console';

@Injectable()
export class EgresadosSystemService {
    constructor() { }

    async getEgresadoByEmailInstitute(email: string, password: string): Promise<Egresado | null> {
        try {
            const { data, error } = await supabase
                .from('tbl_system_egresados')
                .select('*')
                .eq('emailinstitute', email)
                .maybeSingle();


            if (error){
                throw new ServiceUnavailableException( error );
            }

            if (data) {
                const dataInner = data as Egresado;

                if (!dataInner)
                    throw new Error("El egresado no existe");

                if (dataInner && (await bcrypt.compare(password, dataInner.password))) {
                    return data as Egresado;
                }
            }

            throw new Error("El usuario o la contraseña son incorrectos");
        } catch (error) {
            // log(error, 'errorMio');
            throw new Error(error);
        }
    }

}
