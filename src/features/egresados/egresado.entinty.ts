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

    @Column()
    codigo: string;

    @Column()
    programa: string;

    @Column()
    modalitydegree: string;

    @Column()
    datedegree: Date;

    @Column()
    libro: string;

    @Column()
    idividualacta: string;

    @Column()
    folio: string;

    @Column()
    actageneral: string;

    @Column()
    gender: string;

    @Column()
    departament: string;

    @Column()
    municipality: string;

    @Column()
    direction: string;

    @Column()
    phone: string;

    @Column({ nullable: false, unique: true })
    emailinstitute: string;

    @Column({ nullable: false, unique: true })
    emailpersonal: string;

    @Column()
    disability: string;

    @Column()
    typedisability: string;

    @Column()
    faculty: string;

    @Column()
    program: string;

    @Column()
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