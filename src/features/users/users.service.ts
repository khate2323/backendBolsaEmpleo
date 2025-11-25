import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { EntityManager, Repository } from 'typeorm';
import { Role } from '../roles/role.entity';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }


    findAll() {
        return this.usersRepository.find();
    }

    findAllByRoleName(roleName: string): Promise<User[]> {
        return this.usersRepository
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.role', 'role')
            .select([
                'user.id',
                'user.name',
                'user.email',
                'user.isActive',
                'user.isSessionActive',
                'user.role',
                'user.company',
                'user.password',
                'role.id',
                'role.nombre'
            ])
            .where('role.nombre = :roleName', { roleName })
            .getMany();
    }


    async findOne(id: number): Promise<User | null> {
        return await this.usersRepository
            .createQueryBuilder("user")
            .leftJoinAndSelect("user.role", "role")
            .leftJoinAndSelect("user.egresado", "egresado")
            .leftJoinAndSelect("egresado.graduateCurriculum", "graduateCurriculum")
            .leftJoinAndSelect("user.company", "company")
            .select([
                "user.id",
                "user.name",
                "user.email",
                "user.isActive",
                "user.isSessionActive",
                "user.password",
                "role.id",
                "role.nombre",
                "company",
                "company",
                "egresado",
                "egresado.graduateCurriculum",
                "graduateCurriculum",
            ])
            .where("user.id = :id", { id })
            .getOne();
    }


    async findByEmail(email: string) {
        return this.usersRepository.
            createQueryBuilder('user')
            .leftJoinAndSelect('user.role', 'role')
            .leftJoinAndSelect('user.egresado', 'egresado')
            .leftJoinAndSelect('user.company', 'company')
            .select([
                'user.id',
                'user.name',
                'user.email',
                'user.isActive',
                'user.isSessionActive',
                'user.role',
                'user.company',
                'user.egresado',
                'user.password',
                'role.id',
                'role.nombre'
            ])
            .where('user.email = :email', { email })
            .getOne();
    }


    async create(data: Partial<User>, manager?: EntityManager) {
        const repo = manager ? manager.getRepository(User) : this.usersRepository;
        const user = repo.create(data);
        return await repo.save(user);
    }

    update(id: number, data: Partial<User>, manager?: EntityManager) {
        const repo = manager ? manager.getRepository(User) : this.usersRepository;
        return repo.update(id, data);
    }

    remove(id: number) {
        return this.usersRepository.delete(id);
    }
}
