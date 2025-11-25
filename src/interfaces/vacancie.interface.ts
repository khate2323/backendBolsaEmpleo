import { Company } from "src/features/companies/company.entity";

export interface VacancieBase {
    id: number;
    title: string;
    laborSector: any;
    cantVacancies: number;
    salary: string;
    description: string;
    modality: any;
    typeContract: any;
    workingDay: string;
    levelEducation: string;
    experienceRequired: string;
    dateExpires: Date;
    departament: string;
    municipality: string;
    faculty: string;
    program: string;
    disability: boolean;
    typeDisability: string[];
    aditionalRequirements: string[];
    company: Company;
}

export interface VacancieCreateInt extends Omit<VacancieBase, 'id'> { }