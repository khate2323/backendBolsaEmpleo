import { Injectable } from '@nestjs/common';
import { Repository, UpdateResult } from 'typeorm';
import { Vacancy } from './vacancy.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { StatusCurriculumGraduateEnum, StatusVacancyEnum } from 'src/enums/enums.enum';

@Injectable()
export class VacanciesService {
    constructor(
        @InjectRepository(Vacancy)
        private readonly vacancyRepository: Repository<Vacancy>,
    ) { }

    async createVacancy(data: Partial<Vacancy>): Promise<Vacancy> {
        const vacancy = this.vacancyRepository.create(data);
        return await this.vacancyRepository.save(vacancy);
    }

    async findAll(): Promise<Vacancy[]> {
        return await this.vacancyRepository
            .createQueryBuilder('vacancy')
            .leftJoinAndSelect('vacancy.company', 'company')
            .select([
                'vacancy',
                'company.id',
                'company.name',
                'company.email',
                'company.logo'
            ])
            .getMany();
    }

    async findOneById(id: number): Promise<Vacancy | null> {
        return await this.vacancyRepository
            .createQueryBuilder('vacancy')
            .leftJoinAndSelect('vacancy.company', 'company')
            .select([
                'vacancy',
                'company.id',
                'company.name',
                'company.email',
                'company.logo',
                'company.slogan',
            ])
            .andWhere('vacancy.id = :id', { id })
            .getOne();
    }

    async findAllByCompany(companyId: number): Promise<Vacancy[]> {
        return await this.vacancyRepository
            .createQueryBuilder('vacancy')
            .leftJoinAndSelect('vacancy.company', 'company')
            .select([
                'vacancy',
                'company.id',
                'company.name',
                'company.email',
                'company.logo'
            ])
            .andWhere('company.id = :companyId', { companyId })
            .getMany();
    }

    async findAllByStatus(filters?: { status?: StatusCurriculumGraduateEnum, companyId?: number, faculty?: string, keywords?: string[] }): Promise<Vacancy[]> {
        const query = this.vacancyRepository
            .createQueryBuilder('vacancy')
            .leftJoinAndSelect('vacancy.company', 'company')
            .select([
                'vacancy',
                'company.id',
                'company.name',
                'company.email',
                'company.logo'
            ])

        if (filters?.status) query.andWhere('vacancy.status = :status', { status: filters.status })
        if (filters?.companyId) query.andWhere('company.id = :companyId', { companyId: filters.companyId })
        if (filters?.faculty) query.andWhere('vacancy.faculty = :faculty', { faculty: filters.faculty })
        if (filters?.keywords && filters.keywords.length > 0) query.andWhere('vacancy.keywords && :keywords', { keywords: filters.keywords })



        return await query.getMany();
    }

    async changeStatus(id: number, newStatus: StatusVacancyEnum): Promise<UpdateResult> {
        return await this.vacancyRepository.update(id, { status: newStatus });
    }

}
