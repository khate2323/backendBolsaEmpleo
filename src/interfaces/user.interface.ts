import { CompanyInt } from "./company.interface";
import { NotificationInt } from "./notification.interface";
import { RoleInt } from "./role.interface";

export interface UserInt {
    id: number;
    name: string;
    email: string;
    password: string;
    isActive: boolean;
    isSessionActive: boolean;
    role: RoleInt;
    tokensOTP: any;
    company: CompanyInt;
    notifications: NotificationInt[];
}

export interface UserIntCreate {
    name: string;
    email: string;
    password: string;
    isActive: boolean;
    role: any;
}