import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../users/user.entity";
import { GraduateCurriculum } from "../graduate-curriculum/graduateCurriculum.entity";
import { PostulationsEgresadoVacancy } from "../postulations-vacancy/postulationsEgresadoVacancy.entity";
import { Notification } from "../notifications/notification.entity";

@Entity('tbl_egresados')
export class Egresado {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ nullable: true })
    id_egresado: number;

    @Column({ nullable: true, default: false })
    canPostulate: boolean;

    @Column({ nullable: true })
    typeidentification: string;

    @Column({ nullable: false, unique: true })
    identification: string;

    @Column()
    dateexpidentification: string;

    @Column({ nullable: true })
    avatar: string;

    @Column({ nullable: true })
    codigo: string;

    @Column({ nullable: true })
    programa: string;

    @Column({ nullable: true })
    modalitydegree: string;

    @Column({ nullable: true })
    datedegree: Date;

    @Column({ nullable: true })
    libro: string;

    @Column({ nullable: true })
    idividualacta: string;

    @Column({ nullable: true })
    folio: string;

    @Column({ nullable: true })
    actageneral: string;

    @Column({ nullable: true })
    gender: string;

    @Column({ nullable: true })
    departament: string;

    @Column({ nullable: true })
    municipality: string;

    @Column({ nullable: true })
    direction: string;

    @Column({ nullable: true })
    phone: string;

    @Column({ nullable: false, unique: true })
    emailinstitute: string;

    @Column({ nullable: false, unique: true })
    emailpersonal: string;

    @Column({ nullable: true })
    disability: string;

    @Column({ nullable: true })
    typedisability: string;

    @Column({ nullable: true })
    faculty: string;

    @Column({ nullable: true })
    program: string;

    @Column({ nullable: true })
    password: string;

    @Column({ nullable: true, type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: string
    
    @OneToOne(() => User, (user) => user.egresado)
    @JoinColumn()
    user: User;

    @OneToOne(() => GraduateCurriculum, (gc) => gc.egresado,)
    @JoinColumn()
    graduateCurriculum: GraduateCurriculum;

    @OneToMany(() => PostulationsEgresadoVacancy, (p) => p.egresado)
    postulations: PostulationsEgresadoVacancy[];

    @OneToMany(() => Notification, (n) => n.egresado)
    notifications: Notification[];
}