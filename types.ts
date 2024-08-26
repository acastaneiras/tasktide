import {Dayjs} from 'dayjs';

export interface Task {
    id: number;
    title: string;
    description: string;
    columnId?: number;
    startDate?: Dayjs ;
    endDate?: Dayjs;
    completed?: boolean;
    created: string;
    updated?: string;
    users: any[];
}

export interface Column {
    id: number | null;
    title: string;
    icon?: any;
}