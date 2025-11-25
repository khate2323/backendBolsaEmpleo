import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class AdminService {
  constructor(private dataSource: DataSource) { }

  async getCompaniesStats() {
    return await this.dataSource.query(`
      SELECT
        COUNT(*) AS total,
        COUNT(*) FILTER (WHERE status = 'Verificación solicitada') AS requestVerification,
        COUNT(*) FILTER (WHERE status = 'Verificado') AS Verificadas,
        COUNT(*) FILTER (WHERE status = 'Rechazado') AS Rechazadas,
        COUNT(*) FILTER (WHERE status = 'Inactiva') AS Inactivas
      FROM tbl_companies;
    `);
  }

  async getVacanciesStats() {
    return await this.dataSource.query(`
      SELECT
        COUNT(*) AS total,
        COUNT(*) FILTER (WHERE status = 'Publicada') AS Publicadas,
        COUNT(*) FILTER (WHERE status = 'Aceptada') AS Aceptadas,
        COUNT(*) FILTER (WHERE status = 'Cancelada') AS Canceladas,
        COUNT(*) FILTER (WHERE status = 'Cerrada') AS Cerradas,
        COUNT(*) FILTER (WHERE status = 'Rechazada') AS Rechazadas
      FROM tbl_vacancies_company;
    `);
  }

  async getPostulationsStats() {
    return await this.dataSource.query(`
      SELECT
        COUNT(*) AS total,
        COUNT(*) FILTER (WHERE status = 'Postulado') AS Postulados,
        COUNT(*) FILTER (WHERE status = 'Seleccionado') AS Seleccionados,
        COUNT(*) FILTER (WHERE status = 'Rechazado') AS Rechazados
      FROM tbl_postulations_egresado_vacancy;
    `);
  }

  async getEgresadosStats() {
    return await this.dataSource.query(`
      SELECT
        COUNT(*) AS total
      FROM tbl_egresados;
    `);
  }

  async getNotificationsStats() {
    return await this.dataSource.query(`
      SELECT
        COUNT(*) AS total,
        COUNT(*) FILTER (WHERE status = 'Enviado') AS Enviadas,
        COUNT(*) FILTER (WHERE status = 'Visto') AS Vistos,
        COUNT(*) FILTER (WHERE status = 'Leido') AS Leidas
      FROM tbl_notifications;
    `);
  }

  // TRENDS
  async getCompaniesTrend() {
    return await this.dataSource.query(`
        SELECT 
            DATE_TRUNC('month', "createdAt") AS month,
            COUNT(*) AS total
        FROM tbl_companies
        GROUP BY month
        ORDER BY month;
    `);
  }

  async getVacanciesTrend() {
    return await this.dataSource.query(`
        SELECT 
            DATE_TRUNC('month', "createdAt") AS month,
            COUNT(*) AS total
        FROM tbl_vacancies_company
        GROUP BY month
        ORDER BY month;
    `);
  }

  async getAcceptedPostulationsTrend() {
    return await this.dataSource.query(`
        SELECT 
            DATE_TRUNC('month', "postulateAt") AS month,
            COUNT(*) AS total
        FROM tbl_postulations_egresado_vacancy
        WHERE status = 'Seleccionado'
        GROUP BY month
        ORDER BY month;
    `);
  }


  async getTrends() {
    const [
      companies,
      vacancies,
      acceptedPostulations
    ] = await Promise.all([
      this.getCompaniesTrend(),
      this.getVacanciesTrend(),
      this.getAcceptedPostulationsTrend()
    ]);

    return {
      companies,
      vacancies,
      acceptedPostulations
    };
  }


}
