import { Dayjs } from 'dayjs';

export const COMPLETED_COLUMN = 4;

export interface Project {
    id: number;
    name: string;
    color: string;
    userId: string;
}

export interface TaskDependencyRecord {
    taskId: number; //This is the task that the dependency is applied to
    dependentTaskId: number; //This is the task that the dependency is applied to from the perspective of the current task
    dependencyType: 'blockedBy';
}

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
    userId: string;
    completedDate: Dayjs | null;
    dependencies?: TaskDependencyRecord[];
    projectId: number | null;
}

export interface Column {
    id: number | null;
    title: string;
    icon?: any;
}