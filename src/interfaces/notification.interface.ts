import { CompanyInt } from "./company.interface"
import { UserInt } from "./user.interface"

export interface NotificationInt {
    id: number
    title: number
    description: string
    status: string
    createdAt: Date
    company: CompanyInt
    user: UserInt
    extras?: any[]
}

export interface NotificationSaveRequest extends Omit<NotificationInt, 'id' | 'status' | 'createdAt'> { }