import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './role.entity';
import { RolesEnum } from 'src/enums/enums.enum';

@Injectable()
export class RolesService {
    constructor(
        @InjectRepository(Role)
        private rolesRepository: Repository<Role>,
    ) { }

    findAll() {
        return this.rolesRepository.find();
    }

    findOne(id: number) {
        return this.rolesRepository.findOneBy({ id });
    }

    findByRoleName(roleName: RolesEnum): Promise<Role | null> {
        return this.rolesRepository
            .createQueryBuilder('role')
            .where('role.nombre = :roleName', { roleName })
            .getOne();
    }

    create(data: Partial<Role>) {
        const role = this.rolesRepository.create(data);
        return this.rolesRepository.save(role);
    }
}
