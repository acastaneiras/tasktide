import {Dayjs} from 'dayjs';

export interface Task {
    id: number;
    title: string;
    description: string;
    column_id?: number;
    start_date?: Dayjs ;
    end_date: Dayjs;
    completed?: boolean;
    created_at: string;
    updated_at?: string;
    users: number[];
}

export interface Column {
    id: number;
    title: string;
    icon?: string;
}