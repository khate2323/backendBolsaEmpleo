import { StatusVacancyEnum } from "src/enums/enums.enum";
import { Company } from "src/features/companies/company.entity";
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToOne, JoinColumn, CreateDateColumn, OneToMany } from "typeorm";
import { PostulationsEgresadoVacancy } from "../postulations-vacancy/postulationsEgresadoVacancy.entity";


@Entity('tbl_vacancies_company')
export class Vacancy {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    title: string;

    @Column({ nullable: false })
    laborSector: string;

    @Column()
    cantVacancies: number;

    @Column()
    salary: string;

    @Column()
    description: string;

    @Column({ nullable: false })
    modality: string;

    @Column({ nullable: false })
    typeContract: string;

    @Column({ nullable: false })
    workingDay: string;

    @Column({ nullable: false })
    levelEducation: string;

    @Column({ nullable: false })
    experienceRequired: string;

    @Column({ nullable: false })
    dateExpires: Date;

    @Column({ nullable: false })
    departament: string;

    @Column({ nullable: false })
    municipality: string;

    @Column({ nullable: false })
    faculty: string;

    @Column({ nullable: false })
    program: string;

    @Column({ nullable: false })
    disability: boolean;

    @Column("text", { array: true, nullable: true, default: [] })
    typeDisability: string[];
    
    @Column("text", { array: true, nullable: true, default: [] })
    keywords: string[];

    @Column("text", { array: true, nullable: true, default: [] })
    aditionalRequirements: string[];

    @Column({ nullable: false, default: StatusVacancyEnum.PUBLICADA })
    status: string;

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;

    @ManyToOne(() => Company, (c) => c.vacancies, { onDelete: 'CASCADE', eager: true })
    @JoinColumn()
    company: Company;

    @OneToMany(() => PostulationsEgresadoVacancy, (p) => p.vacancy)
    postulations: PostulationsEgresadoVacancy[];
}