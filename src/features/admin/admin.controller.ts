import { Controller, Get } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
    constructor(
        private readonly adminService: AdminService
    ) { }

    @Get("all-stats")
    async getStats() {
        const [
            companies,
            vacancies,
            postulations,
            egresados,
            notifications
        ] = await Promise.all([
            this.adminService.getCompaniesStats(),
            this.adminService.getVacanciesStats(),
            this.adminService.getPostulationsStats(),
            this.adminService.getEgresadosStats(),
            this.adminService.getNotificationsStats()
        ]);

        return {
            companies: companies[0],
            vacancies: vacancies[0],
            postulations: postulations[0],
            egresados: egresados[0],
            notifications: notifications[0]
        };
    }


    @Get('trends')
    async getAllTrends() {
        return await this.adminService.getTrends();
    }

}
