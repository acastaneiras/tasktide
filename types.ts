import { Dayjs } from 'dayjs';

export const COMPLETED_COLUMN = 4;

export interface Task {
    id: number;
    title: string;
    description: string;
    columnId?: number | null;
    startDate?: Dayjs;
    endDate?: Dayjs;
    completed?: boolean;
    created: string;
    updated?: string;
    users: any[];
    completedDate: Dayjs | null;
}

export interface Column {
    id: number | null;
    title: string;
    icon?: any;
}