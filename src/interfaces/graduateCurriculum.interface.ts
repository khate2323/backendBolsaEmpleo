import { UserInt } from "./user.interface";

export interface GraduateCurriculumBase {
    id: number;
    presentation: string;
    resume: string;
    status: string;
    experiences: string[];
    educations: string[];
    lenguages: string[];
    keywords: string[];
    cv: string;
    createdAt: Date;
    egresado: UserInt;
}

export interface GraduateCurriculumRequest extends Omit<GraduateCurriculumBase, 'egresado' | 'createdAt' | 'id'> { }