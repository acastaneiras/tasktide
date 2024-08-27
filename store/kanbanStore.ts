import { Task } from '@/types';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface KanbanState {
    tasks: Task[];
    isEditDialogOpen: boolean;
    isDeleteDialogOpen: boolean;
    selectedTaskId: number | null;
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
                setTasks: (tasks) => set({ tasks }),
                setIsEditDialogOpen: (isOpen) => set({ isEditDialogOpen: isOpen }),
                setIsDeleteDialogOpen: (isOpen) => set({ isDeleteDialogOpen: isOpen }),
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

                    set({ tasks: updatedTasks });
                },
                setSelectedTaskId: (id) => set({ selectedTaskId: id }),
                getTaskById: (taskId) => get().tasks.find(task => task.id === taskId),
            }),
            { name: 'kanbanStore' },
        ),
    ),
);
