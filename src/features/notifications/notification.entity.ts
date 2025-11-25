import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Company } from "../companies/company.entity";
import { User } from "../users/user.entity";
import { StatusNotificationEnum } from "src/enums/enums.enum";
import { Egresado } from "../egresados/egresado.entinty";

@Entity('tbl_notifications')
export class Notification {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    title: string

    @Column()
    description: string

    @Column({ nullable: true })
    extras: string

    @Column({ nullable: false, type: 'enum', enum: StatusNotificationEnum, default: StatusNotificationEnum.ENVIADO })
    status: string

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;

    @ManyToOne(() => Company, (c) => c.vacancies, { onDelete: 'CASCADE', eager: true })
    @JoinColumn()
    company: Company;

    @ManyToOne(() => User, (c) => c.notifications, { onDelete: 'CASCADE', eager: true })
    @JoinColumn()
    user: User;
    
    @ManyToOne(() => Egresado, (c) => c.notifications, { onDelete: 'CASCADE', eager: true })
    @JoinColumn()
    egresado: Egresado;

}