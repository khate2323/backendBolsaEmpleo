import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../users/user.entity";
import { Egresado } from "../egresados/egresado.entinty";
import { StatusCurriculumGraduateEnum } from "src/enums/enums.enum";

@Entity('tbl_graduates_curriculums')
export class GraduateCurriculum {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    presentation: string;

    @Column({ nullable: true })
    resume: string;

    @Column({ nullable: false, default: StatusCurriculumGraduateEnum.SIN_COMPLETAR })
    status: string;

    @Column("text", { array: true, nullable: true, default: [] })
    experiences: string[];

    @Column("text", { array: true, nullable: true, default: [] })
    educations: string[];

    @Column("text", { array: true, nullable: true, default: [] })
    lenguages: string[];

    @Column("text", { array: true, nullable: true, default: [] })
    keywords: string[];

    @Column("text", { nullable: true, default: '' })
    cv: string;

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;

    @OneToOne(() => Egresado, (e) => e.graduateCurriculum, {  eager: true })
    @JoinColumn()
    egresado: User;
}