import { Injectable } from '@nestjs/common';
import { GraduateCurriculum } from './graduateCurriculum.entity';
import { EntityManager, Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class GraduateCurriculumService {
    constructor(
        @InjectRepository(GraduateCurriculum)
        private graduateCurriculumRepository: Repository<GraduateCurriculum>,
    ) { }

    async create(data: Partial<GraduateCurriculum>, manager?: EntityManager): Promise<GraduateCurriculum> {
        const repo = manager ? manager.getRepository(GraduateCurriculum) : this.graduateCurriculumRepository;
        const curriculum = repo.create(data);
        return await repo.save(curriculum);
    }

    async findOneByIdEgresadoId(id: number): Promise<GraduateCurriculum | null> {
        return await this.graduateCurriculumRepository.
            createQueryBuilder('graduateCurriculum')
            .leftJoinAndSelect('graduateCurriculum.egresado', 'egresado')
            .select(['graduateCurriculum', 'egresado'])
            .andWhere('graduateCurriculum.egresado = :id', { id })
            .getOne();
    }
    
    async findOneById(id: number): Promise<GraduateCurriculum | null> {
        return await this.graduateCurriculumRepository.
            createQueryBuilder('graduateCurriculum')
            .leftJoinAndSelect('graduateCurriculum.egresado', 'egresado')
            .select(['graduateCurriculum', 'egresado'])
            .andWhere('graduateCurriculum.id = :id', { id })
            .getOne();
    }

    async update(id: number, data: Partial<GraduateCurriculum>, manager?: EntityManager): Promise<UpdateResult> {
        const repo = manager ? manager.getRepository(GraduateCurriculum) : this.graduateCurriculumRepository;
        return await repo.update(id, data);
    }
}
