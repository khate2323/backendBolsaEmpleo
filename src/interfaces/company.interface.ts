import { NotificationInt } from "./notification.interface"
import { VacancieBase } from "./vacancie.interface"

export interface CompanyInt {
    id: number
    status: string
    name: string
    direction: string
    departament: string
    municipality: string
    nit: string
    legalRepresentativeName: string
    companyType: string
    phone: string
    email: string
    webSite: string
    numberEmployes: string
    description: string
    logo: string
    slogan: string
    ChamberofCommerce: string
    rut: string
    certificateofExistence: string
    legalRepresentativeDocument: string
    bankCertification: string
    vacancies: VacancieBase[];
    notifications: NotificationInt[];
    // user: User;
}