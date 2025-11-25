import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from './notification.entity';
import { Injectable } from '@nestjs/common';
import { Repository, UpdateResult } from 'typeorm';
import { StatusNotificationEnum } from 'src/enums/enums.enum';

@Injectable()
export class NotificationsService {
    constructor(
        @InjectRepository(Notification)
        private notificationRepository: Repository<Notification>,
    ) { }

    async saveNotification(data: Partial<Notification>): Promise<Notification> {
        const notification = this.notificationRepository.create(data);
        return await this.notificationRepository.save(notification);
    }

    async findAll(): Promise<Notification[]> {
        return this.notificationRepository
            .createQueryBuilder('notification')
            .leftJoinAndSelect('notification.company', 'company')
            .select([
                'notification',
                'company.id',
                'company.name',
                'company.email',
                'company.logo'
            ])
            .getMany();
    }

    async findAllByCompanyId(idCompany: number): Promise<Notification[]> {
        return this.notificationRepository
            .createQueryBuilder('notification')
            .leftJoinAndSelect('notification.company', 'company')
            .select([
                'notification',
                'company.id',
                'company.name',
                'company.email',
                'company.logo'
            ])
            .andWhere('company.id = :idCompany', { idCompany })
            .getMany();
    }

    async findAllByUserId(idUser: number): Promise<Notification[]> {
        return this.notificationRepository
            .createQueryBuilder('notification')
            .leftJoinAndSelect('notification.user', 'user')
            .select([
                'notification',
                'user.id',
                'user.name',
                'user.email',
                // 'user.avatar'
            ])
            .andWhere('user.id = :idUser', { idUser })
            .getMany();
    }
    
    async findAllByEgresadoId(idEgresado: number): Promise<Notification[]> {
        return this.notificationRepository
            .createQueryBuilder('notification')
            .leftJoinAndSelect('notification.egresado', 'egresado')
            .select([
                'notification',
                'egresado.user',
            ])
            .andWhere('egresado.id = :idEgresado', { idEgresado })
            .getMany();
    }

    async findOneById(id: number): Promise<Notification | null> {
        return this.notificationRepository
            .createQueryBuilder('notification')
            .leftJoinAndSelect('notification.company', 'company')
            .select([
                'notification',
                'company.id',
                'company.name',
                'company.email',
                'company.logo'
            ])
            .andWhere('notification.id = :id', { id })
            .getOne();
    }


    async changeStatus(id: number, newStatus: StatusNotificationEnum): Promise<UpdateResult> {
        return await this.notificationRepository.update(id, { status: newStatus });
    }

}
