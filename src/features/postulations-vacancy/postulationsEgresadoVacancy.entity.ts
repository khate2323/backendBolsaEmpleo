import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { StatusNotificationEnum, StatusPostulationEnum } from "src/enums/enums.enum";
import { Vacancy } from "../vacancies/vacancy.entity";
import { Egresado } from "../egresados/egresado.entinty";

@Entity('tbl_postulations_egresado_vacancy')
export class PostulationsEgresadoVacancy {

    @PrimaryGeneratedColumn()
    id: number

    @Column({
        nullable: false,
        type: 'enum',
        enum: StatusPostulationEnum,
        default: StatusPostulationEnum.POSTULADO
    })
    status: string;

    @CreateDateColumn({ type: "timestamp" })
    postulateAt: Date;

    @ManyToOne(() => Vacancy, (v) => v.postulations, { onDelete: 'CASCADE', eager: true })
    @JoinColumn()
    vacancy: Vacancy;

    @ManyToOne(() => Egresado, (e) => e.postulations, { onDelete: 'CASCADE', eager: true })
    @JoinColumn({ name: 'egresadoId' })
    egresado: Egresado;

}