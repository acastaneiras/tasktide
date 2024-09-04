import { Task } from '@root/types';
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
    changeDependency: (eventType: string, newDependency?: any, oldDependency?: any) => void;
    setSelectedTaskId: (id: number | null) => void;
    getTaskById: (taskId: number | null) => Task | undefined;
    isTaskBlocked: (taskId: number | null) => Task[];
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
                changeDependency: (eventType, newDependency, oldDependency) => {
                    const { tasks } = get();
                    let updatedTasks: Task[] = [...tasks];

                    switch (eventType) {
                        case 'INSERT':
                        case 'UPDATE':
                            updatedTasks = updatedTasks.map(task => {
                                if (task.id === newDependency.taskId) {
                                    return {
                                        ...task,
                                        dependencies: [
                                            ...(task.dependencies || []).filter(dep => dep.dependentTaskId !== newDependency.dependentTaskId),
                                            newDependency
                                        ]
                                    };
                                }
                                return task;
                            });
                            break;
                        case 'DELETE':
                            updatedTasks = updatedTasks.map(task => {
                                return {
                                    ...task,
                                    dependencies: (task.dependencies || []).filter(dep => dep.dependentTaskId !== oldDependency.dependentTaskId)
                                };
                            });
                            updatedTasks = updatedTasks.filter(task => task.id !== oldDependency.taskId);
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

                isTaskBlocked: (taskId) => {
                    const task = get().getTaskById(taskId);
                    if (!task || !task.dependencies) return [];

                    const blockedBy = task.dependencies.filter(dep => dep.dependencyType === 'blockedBy');
                    let blocked: Task[] = [];

                    blockedBy.forEach(dep => {
                        const dependentTask = get().getTaskById(dep.dependentTaskId);
                        if (dependentTask && !dependentTask.completed) {
                            blocked.push(dependentTask);
                        }
                    });

                    return blocked;
                },
            }),
            { name: 'kanbanStore' },
        ),
    ),
);
