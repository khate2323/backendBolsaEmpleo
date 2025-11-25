import { IsNotEmpty } from 'class-validator';
import { Role } from 'src/features/roles/role.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, IsNull, OneToMany, OneToOne } from 'typeorm';
import { TokenOTP } from '../auth/tokens-otp/tokenOtp.entity';
import { Company } from '../companies/company.entity';
import { Notification } from '../notifications/notification.entity';
import { Egresado } from '../egresados/egresado.entinty';

@Entity('tbl_users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Column({ nullable: false })
  @IsNotEmpty({ message: 'El nombre es requerido' })
  name: string;

  @Column({ unique: true })
  @Column({ nullable: false })
  @IsNotEmpty({ message: 'El correo es requerido' })
  email: string;

  @Column()
  @Column({ nullable: false })
  @IsNotEmpty({ message: 'La contraseña es requerida' })
  password: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isSessionActive: boolean;

  @ManyToOne(() => Role, (role) => role.users, { eager: true })
  @JoinColumn({ name: 'role_id' })
  role: Role;

  // 👇 Relación con TokenOTP
  @OneToMany(() => TokenOTP, (token) => token.user)
  tokensOTP: TokenOTP[];

  @OneToOne(() => Company, (company) => company.user, { cascade: true, eager: true })
  @JoinColumn()
  company?: Company;

  @OneToOne(() => Egresado, (e) => e.user, { cascade: true, eager: true })
  @JoinColumn()
  egresado?: Egresado;

  @OneToMany(() => Notification, (n) => n.user)
  notifications: Notification[];
}
