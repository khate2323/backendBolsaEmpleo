import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from './company.entity';
import { EntityManager, Repository, UpdateResult } from 'typeorm';
import { StatusCompanyEnum } from 'src/enums/enums.enum';

@Injectable()
export class CompaniesService {
    constructor(
        @InjectRepository(Company)
        private readonly companyRepository: Repository<Company>,
    ) { }

    async findAll(filters?: { status?: StatusCompanyEnum; name?: string }): Promise<Company[]> {
        const query = this.companyRepository.createQueryBuilder('company')
            .leftJoinAndSelect('company.user', 'user')
            .select([
                'company',
                'user.id',
                'user.name',
                'user.email',
            ]);

        if (filters?.status) {
            query.andWhere('company.status = :status', { status: filters.status });
        }

        if (filters?.name) {
            query.andWhere('company.name LIKE :name', { name: `%${filters.name}%` });
        }

        return await query.getMany();
    }

    async findOne(id: number): Promise<Company | null> {
        return this.companyRepository.findOne({ where: { id } });
    }

    async create(company: Partial<Company>, manager?: EntityManager): Promise<Company> {
        const repo = manager ? manager.getRepository(Company) : this.companyRepository;

        const dataToSave = repo.create(company);
        const newCompany = await repo.save(dataToSave);

        const { user, ...result } = newCompany
        return result as Company;
    }

    async update(id: number, company: Partial<Company>, manager?: EntityManager): Promise<UpdateResult> {
        const repo = manager ? manager.getRepository(Company) : this.companyRepository;
        return await repo.update(id, company);
    }

    async changeStatusCompany(idCompany: number, newStatus: StatusCompanyEnum, manager?: EntityManager): Promise<UpdateResult> {
        const repo = manager ? manager.getRepository(Company) : this.companyRepository;
        return await repo.update(idCompany, { status: newStatus });
    }


}
