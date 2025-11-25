import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "src/features/users/user.entity";

@Entity("tbl_tokens_otp")
export class TokenOTP {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    token: string

    @Column({ default: true })
    isValid: boolean

    @Column()
    createdAt: Date

    @Column()
    expiredAt: Date

    @Column({ nullable: true })
    usedAt: Date

    // 👇 Relación con usuario: muchos tokens pueden pertenecer a un usuario
    @ManyToOne(() => User, { eager: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

}