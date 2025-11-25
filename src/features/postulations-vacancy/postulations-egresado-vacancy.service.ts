import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vacancy } from '../vacancies/vacancy.entity';
import { StatusPostulationEnum } from 'src/enums/enums.enum';
import { Egresado } from '../egresados/egresado.entinty';
import { PostulationsEgresadoVacancy } from './postulationsEgresadoVacancy.entity';

@Injectable()
export class PostulationsEgresadoVacancyService {

    constructor(
        @InjectRepository(PostulationsEgresadoVacancy)
        private readonly postulationsRepo: Repository<PostulationsEgresadoVacancy>,

        @InjectRepository(Vacancy)
        private readonly vacancyRepo: Repository<Vacancy>,

        @InjectRepository(Egresado)
        private readonly egresadoRepo: Repository<Egresado>,
    ) { }

    // ------------------------------------------------------------------
    // 1️⃣ Crear postulación (POSTULARSE)
    // ------------------------------------------------------------------
    async create(vacancyId: number, egresadoId: number): Promise<PostulationsEgresadoVacancy> {

        const vacancy = await this.vacancyRepo.findOne({ where: { id: vacancyId } });
        if (!vacancy) throw new NotFoundException("La vacante no existe");

        if (vacancy.dateExpires < new Date()) {
            throw new BadRequestException("La vacante está vencida");
        }

        const egresado = await this.egresadoRepo.findOne({ where: { id: egresadoId } });
        if (!egresado) throw new NotFoundException("El egresado no existe");

        if (egresado.canPostulate === false) {
            throw new BadRequestException("Este egresado no tiene permisos para postularse");
        }

        // Evitar postulaciones duplicadas
        const already = await this.postulationsRepo.findOne({
            where: { vacancy: { id: vacancyId }, egresado: { id: egresadoId } }
        });

        if (already) {
            throw new BadRequestException("Ya estás postulado a esta vacante");
        }

        const postulation = this.postulationsRepo.create({
            vacancy,
            egresado,
            status: StatusPostulationEnum.POSTULADO,
        });

        return await this.postulationsRepo.save(postulation);
    }

    // ------------------------------------------------------------------
    // 2️⃣ Cancelar postulación (DARSE DE BAJA)
    // ------------------------------------------------------------------
    async deletePostulation(id: number): Promise<void> {
        const existing = await this.postulationsRepo.findOne({ where: { id } });

        if (!existing) throw new NotFoundException("La postulación no existe");

        await this.postulationsRepo.remove(existing);
    }

    // ------------------------------------------------------------------
    // 3️⃣ Cambiar estado de la postulación
    // (Solo empresa o administrador)
    // ------------------------------------------------------------------
    async updateStatus(id: number, status: StatusPostulationEnum): Promise<PostulationsEgresadoVacancy> {

        const postulation = await this.postulationsRepo.findOne({ where: { id } });
        if (!postulation) throw new NotFoundException("Postulación no encontrada");

        postulation.status = status;
        return await this.postulationsRepo.save(postulation);
    }

    // ------------------------------------------------------------------
    // 4️⃣ Obtener postulaciones por vacante
    // ------------------------------------------------------------------
    async findByVacancy(vacancyId: number): Promise<PostulationsEgresadoVacancy[]> {
        return await this.postulationsRepo.find({
            where: { vacancy: { id: vacancyId } },
            order: { postulateAt: 'DESC' }
        });
    }

    // ------------------------------------------------------------------
    // 5️⃣ Obtener postulaciones por egresado
    // ------------------------------------------------------------------
    async findByEgresado(egresadoId: number): Promise<PostulationsEgresadoVacancy[]> {
        return await this.postulationsRepo.find({
            where: { egresado: { id: egresadoId } },
            order: { postulateAt: 'DESC' }
        });
    }

    // ------------------------------------------------------------------
    // 6️⃣ Obtener una sola postulación
    // ------------------------------------------------------------------
    async findOne(id: number): Promise<PostulationsEgresadoVacancy> {
        const postulation = await this.postulationsRepo.findOne({ where: { id } });

        if (!postulation) throw new NotFoundException("Postulación no encontrada");

        return postulation;
    }

    // ------------------------------------------------------------------
    // 6️⃣ Saber si por id vacante y id egresado si esta postulado ya o no
    // ------------------------------------------------------------------
    async isPostulated(vacancyId: number, egresadoId: number): Promise<boolean> {
        const postulation = await this.postulationsRepo.findOne({
            where: { vacancy: { id: vacancyId }, egresado: { id: egresadoId } }
        });

        return postulation ? true : false;
    }
}
