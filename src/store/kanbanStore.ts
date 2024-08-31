import { Task } from '@root/types';
import dayjs from 'dayjs';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface KanbanState {
    tasks: Task[];
    isEditDialogOpen: boolean;
    isDeleteDialogOpen: boolean;
    selectedTaskId: number | null;
    breakPoint: number | null;
    setTasks: (tasks: Task[]) => void;
    setIsEditDialogOpen: (isOpen: boolean) => void;
    setIsDeleteDialogOpen: (isOpen: boolean) => void;
    changeTask: (eventType: string, newTask?: Task, oldTask?: Task) => void;
    setSelectedTaskId: (id: number | null) => void;
    getTaskById: (taskId: number | null) => Task | undefined;
}

export const useKanbanStore = create<KanbanState>()(
    devtools(
        persist(
            (set, get) => ({
                tasks: [],
                isEditDialogOpen: false,
                isDeleteDialogOpen: false,
                selectedTaskId: null,
                breakPoint: null,
                setTasks: (tasks) => set({ tasks }),
                setIsEditDialogOpen: (isOpen) => {
                    if (isOpen) {
                        set({ isEditDialogOpen: true, breakPoint: Date.now() });
                    } else {
                        const state = get();
                        if (Date.now() - (state.breakPoint || 0) < 100) {
                            set({ isEditDialogOpen: true });
                        } else {
                            set({ isEditDialogOpen: false });
                        }
                    }
                },
                setIsDeleteDialogOpen: (isOpen) => {
                    if (isOpen) {
                        set({ isDeleteDialogOpen: true, breakPoint: Date.now() });
                    } else {
                        const state = get();
                        if (Date.now() - (state.breakPoint || 0) < 100) {
                            set({ isDeleteDialogOpen: true });
                        } else {
                            set({ isDeleteDialogOpen: false });
                        }
                    }
                },
                changeTask: (eventType, newTask, oldTask) => {
                    const { tasks } = get();
                    let updatedTasks: Task[] = [...tasks];

                    switch (eventType) {
                        case 'INSERT':
                            updatedTasks = [...updatedTasks, newTask as Task];
                            break;
                        case 'UPDATE':
                            updatedTasks = updatedTasks.map(task => task.id === newTask!.id ? newTask as Task : task);
                            break;
                        case 'DELETE':
                            updatedTasks = updatedTasks.filter(task => task.id !== oldTask!.id);
                            break;
                        default:
                            break;
                    }

                    updatedTasks.sort((a, b) => {
                        if (!a.endDate) return 1;
                        if (!b.endDate) return -1;
                        return a.endDate!.diff(b.endDate!);
                    });

                    set({ tasks: updatedTasks });
                },
                setSelectedTaskId: (id) => set({ selectedTaskId: id }),
                getTaskById: (taskId) => get().tasks.find(task => task.id === taskId),
            }),
            { name: 'kanbanStore' },
        ),
    ),
);
