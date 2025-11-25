import { Vacancy } from "src/features/vacancies/vacancy.entity";
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../users/user.entity";
import { StatusCompanyEnum, TypesCompanyEnum } from "src/enums/enums.enum";
import { Notification } from "../notifications/notification.entity";

@Entity('tbl_companies')
export class Company {

    @PrimaryGeneratedColumn()
    id: number

    @Column({ nullable: false, type: 'enum', enum: StatusCompanyEnum, default: StatusCompanyEnum.NUEVO })
    status: string

    @Column({ nullable: true })
    name: string

    @Column({ nullable: true })
    direction: string

    @Column({ nullable: true })
    departament: string

    @Column({ nullable: true })
    municipality: string

    @Column({ unique: true, nullable: false })
    nit: string

    @Column({ nullable: true })
    legalRepresentativeName: string

    @Column({ nullable: true, type: 'enum', enum: TypesCompanyEnum })
    companyType: string

    @Column({ nullable: true })
    phone: string

    @Column({ nullable: true })
    email: string

    @Column({ nullable: true })
    webSite: string

    @Column({ nullable: true })
    numberEmployes: string

    @Column({ nullable: true })
    description: string

    @Column({ nullable: true })
    logo: string

    @Column({ nullable: true })
    slogan: string

    @Column({ nullable: true })
    ChamberofCommerce: string

    @Column({ nullable: true })
    rut: string

    @Column({ nullable: true })
    certificateofExistence: string

    @Column({ nullable: true })
    legalRepresentativeDocument: string

    @Column({ nullable: true })
    bankCertification: string

    @Column({ nullable: true, type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: string

    @OneToMany(() => Vacancy, (vacancy) => vacancy.company)
    vacancies: Vacancy[];

    @OneToMany(() => Notification, (n) => n.company)
    notifications: Notification[];

    @OneToOne(() => User, (user) => user.company)
    @JoinColumn()
    user: User;

}