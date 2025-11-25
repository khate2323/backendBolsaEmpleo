import { Injectable } from '@nestjs/common';
import { Egresado } from './egresado.entinty';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class EgresadosService {
    constructor(
        @InjectRepository(Egresado)
        private egresadoRepository: Repository<Egresado>,
    ) { }

    async findAll(): Promise<Egresado[]> {
        return await this.egresadoRepository.find();
    }

    async findOneById(id: number): Promise<Egresado | null> {
        return await this.egresadoRepository.
            createQueryBuilder('egresado')
            .leftJoinAndSelect('egresado.graduateCurriculum', 'graduateCurriculum')
            .select(['egresado.graduateCurriculum', 'graduateCurriculum'])
            .andWhere('egresado.id = :id', { id })
            .getOne();
    }

    async create(data: Partial<Egresado>, manager?: EntityManager): Promise<Egresado> {
        const repo = manager ? manager.getRepository(Egresado) : this.egresadoRepository;
        const egresado = repo.create(data);
        return await repo.save(egresado);
    }

    update(id: number, data: Partial<Egresado>, manager?: EntityManager) {
        const repo = manager ? manager.getRepository(Egresado) : this.egresadoRepository;
        return repo.update(id, data);
    }
}
