export interface EmailDataSend {
    to: string;
    subject: string;
    text: string;
}

export interface RejectVacancyEmailRequest {
    to: string;
    name: string;
    title: string;
    createdAt: string;
    motive: string
}
export interface AcceptVacancyEmailRequest {
    to: string;
    name: string;
    title: string;
    createdAt: string;
}

export interface InfoStatusCompanyEmailRequest {
    to: string;
    name: string;
    status: string;
}


export interface EmailResponseSend {
    accepted: string[];
    rejected: any[];
    envelopeTime: number;
    messageTime: number;
    messageSize: number;
    response: string;
    envelope: Envelope;
    messageId: string;
}

interface Envelope {
    from: string;
    to: string[];
}