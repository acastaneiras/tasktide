import { Project, Task } from '@root/types';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface KanbanState {
    tasks: Task[];
    projects: Project[];
    selectedProjectId: number | null;
    selectedEditProject: { id?: number; name: string; color: string } | null;
    isProjectDialogOpen: boolean;
    isDeleteProjectDialogOpen: boolean;
    isEditProjectDialogOpen: boolean,
    isAddDialogOpen: boolean;
    isEditDialogOpen: boolean;
    isDeleteDialogOpen: boolean;
    selectedTaskId: number | null;
    breakPoint: number | null;
    setSelectedProjectId: (id: number | null) => void;
    setTasks: (tasks: Task[]) => void;
    setProjects: (projects: Project[]) => void;
    setIsProjectDialogOpen: (isOpen: boolean) => void;
    setIsAddDialogOpen: (isOpen: boolean) => void;
    setIsEditDialogOpen: (isOpen: boolean) => void;
    setIsDeleteDialogOpen: (isOpen: boolean) => void;
    setIsDeleteProjectDialogOpen: (isOpen: boolean) => void;
    changeTask: (eventType: string, newTask?: Task, oldTask?: Task) => void;
    changeDependency: (eventType: string, newDependency?: any, oldDependency?: any) => void;
    setSelectedTaskId: (id: number | null) => void;
    getTaskById: (taskId: number | null) => Task | undefined;
    isTaskBlocked: (taskId: number | null) => Task[];
    setSelectedEditProject: (project: Project | null) => void;
    changeProject: (eventType: string, newProject?: Project, oldProject?: Project) => void;
}

export const useKanbanStore = create<KanbanState>()(
    devtools(
        persist(
            (set, get) => ({
                tasks: [],
                projects: [],
                selectedProjectId: null,
                selectedEditProject: null,
                isProjectDialogOpen: false,
                isEditProjectDialogOpen: false,
                isDeleteProjectDialogOpen: false,
                isAddDialogOpen: false,
                isEditDialogOpen: false,
                isDeleteDialogOpen: false,
                selectedTaskId: null,
                breakPoint: null,
                setTasks: (tasks) => set({ tasks }),
                setSelectedProjectId: (id) => set({ selectedProjectId: id }),
                setSelectedEditProject: (project: any) => set({ selectedEditProject: project }),
                setProjects: (projects) => {
                    projects.sort((a, b) => a.id - b.id);
                    set({ projects });
                },
                setIsProjectDialogOpen: (isOpen: boolean) => {
                    if (isOpen) {
                        set({ isProjectDialogOpen: true, breakPoint: Date.now() });
                    } else {
                        const state = get();
                        if (Date.now() - (state.breakPoint || 0) < 100) {
                            set({ isProjectDialogOpen: true });
                        } else {
                            set({ isProjectDialogOpen: false });
                        }
                    }
                },
                changeProject: (eventType: string, newProject?: Project, oldProject?: Project) => {
                    const { projects } = get();
                    let updatedProjects = [...projects];

                    switch (eventType) {
                        case 'INSERT':
                            updatedProjects = [...updatedProjects, newProject as Project];
                            //if we are adding a project, set it as the selected project
                            set({ selectedProjectId: newProject!.id });
                            break;
                        case 'UPDATE':
                            updatedProjects = updatedProjects.map(project =>
                                project.id === newProject!.id ? newProject as Project : project
                            );
                            break;
                        case 'DELETE':
                            updatedProjects = updatedProjects.filter(project => project.id !== oldProject!.id);
                            //if the deleted project is the selected project, reset the selected project
                            if (oldProject!.id === get().selectedProjectId) {
                                if (projects.length > 0) {
                                    set({ selectedProjectId: projects[0].id });
                                }
                            }
                            break;
                        default:
                            break;
                    }

                    updatedProjects.sort((a, b) => a.id - b.id);

                    set({ projects: updatedProjects });
                },
                setIsAddDialogOpen: (isOpen: boolean) => {
                    if (isOpen) {
                        set({ isAddDialogOpen: true, breakPoint: Date.now() });
                    } else {
                        const state = get();
                        if (Date.now() - (state.breakPoint || 0) < 100) {
                            set({ isAddDialogOpen: true });
                        } else {
                            set({ isAddDialogOpen: false });
                        }
                    }
                },
                setIsEditDialogOpen: (isOpen: boolean) => {
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
                setIsDeleteDialogOpen: (isOpen: boolean) => {
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
                setIsDeleteProjectDialogOpen: (isOpen: boolean) => {
                    if (isOpen) {
                        set({ isDeleteProjectDialogOpen: true, breakPoint: Date.now() });
                    } else {
                        const state = get();
                        if (Date.now() - (state.breakPoint || 0) < 100) {
                            set({ isDeleteProjectDialogOpen: true });
                        } else {
                            set({ isDeleteProjectDialogOpen: false });
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
