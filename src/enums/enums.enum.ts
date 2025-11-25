export enum RolesEnum {
    ADMIN = 'admin',
    COMPANY = 'empresa',
    EGRERSADO = 'egresado',
}

export enum StatusCompanyEnum {
    NUEVO = 'Nuevo',
    VERIFICACIO_SOLICITADA = 'Verificación solicitada',
    EN_PROCESO_VERIFICACION = 'En proceso de verificación',
    VERIFICADO = 'Verificado',
    RECHAZADO = 'Rechazado',
    INACTIVA = 'Inactiva',
}

export enum StatusNotificationEnum {
    ENVIADO = 'Enviado',
    VISTO = 'Visto',
    LEIDO = 'Leido',
    ELIMINADO = 'Eliminado',
}

export enum StatusPostulationEnum {
    POSTULADO = 'Postulado',
    POSTULACION_VISTA = 'Postulacion vista',
    EN_PROCEOS = 'En proceso',
    SELECCIONADO = 'Seleccionado',
    RECHAZADO = 'Rechazado',
    VACANTE_CERRADA = 'Vacante cerrada',
}

export enum TypesCompanyEnum {
    PRIVADA = 'Privada',
    PUBLICA = 'Publica',
    MIXTA = 'Mixta',
    ONG = 'ONG',
    CONSULTORA = 'Consultora',
    COOPERATIVA = 'Cooperativa',
}

export enum StatusVacancyEnum {
    PUBLICADA = 'Publicada',
    ACEPTADA = 'Aceptada',
    CANCELADA = 'Cancelada',
    RECHAZADA = 'Rechazada',
    EN_PROCESO = 'En proceso',
    CERRADA = 'Cerrada',
}

export enum StatusCurriculumGraduateEnum {
    SIN_COMPLETAR = 'Sin completar',
    EN_PROCESO = 'En proceso',
    COMPLETADA = 'Completada',
}