'use client'
import { addOrUpdateTask, deleteTask } from '@/actions/DashboardActions'
import DeleteTaskDialog from '@/components/custom/kanban/DeleteTaskDialog'
import EditTaskDialog from '@/components/custom/kanban/EditTaskDialog'
import KanbanBoard from '@/components/custom/kanban/KanbanBoard'
import KanbanBoardContainer from '@/components/custom/kanban/KanbanBoardContainer'
import KanbanColumn from '@/components/custom/kanban/KanbanColumn'
import KanbanTask from '@/components/custom/kanban/KanbanTask'
import { KanbanTaskCardMemo } from '@/components/custom/kanban/KanbanTaskCard'
import NoTasks from '@/components/custom/kanban/NoTasks'
import { useKanbanStore } from '@/store/kanbanStore'
import { kanbanColumns } from '@/utils/kanbanColumns'
import { createClient } from '@/utils/supabase/client'
import { DragEndEvent } from '@dnd-kit/core'
import { Column, COMPLETED_COLUMN, Project, Task, TaskDependencyRecord } from '@root/types'
import dayjs from 'dayjs'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import AddTaskDialog from './AddTaskDialog'
import KanbanColumnSkeleton from './KanbanColumnSkeleton'
import ProjectDialog from './ProjectDialog'
import DeleteProjectDialog from './DeleteProjectDialog'
import NoProjects from './NoProjects'


const KanbanClientComponent = ({ userId }: { userId: string }) => {
    const supabase = createClient();
    const columns = kanbanColumns as Column[];
    const { tasks, projects, isDeleteProjectDialogOpen, selectedProjectId, selectedEditProject, changeProject, setSelectedProjectId, setTasks, setProjects, changeTask, isDeleteDialogOpen, isEditDialogOpen, isProjectDialogOpen, setIsDeleteDialogOpen, changeDependency, selectedTaskId, setSelectedTaskId, setIsAddDialogOpen, isAddDialogOpen } = useKanbanStore();
    const [loading, setLoading] = useState(true);
    const [selectedColumnId, setSelectedColumnId] = useState<number | null>(null);

    useEffect(() => {
        const callFetch = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('tasks')
                .select('*, task_dependencies_taskid_fkey(dependentTaskId, dependencyType)')
                .eq('userId', userId)
                .order('endDate', { ascending: true });
            if (error) {
                toast.error('Error fetching tasks');
                return;
            }

            const tasks = (data as any[]).map(task => ({
                ...task,
                startDate: task.startDate ? dayjs(task.startDate) : undefined,
                endDate: task.endDate ? dayjs(task.endDate) : undefined,
                completedDate: task.completedDate ? dayjs(task.completedDate) : null,
                dependencies: task.task_dependencies_taskid_fkey || [],
            }));

            const { data: responseData, error: fetchError } = await supabase
                .from('projects')
                .select('*')
                .eq('userId', userId);

            if (fetchError) {
                toast.error('Error fetching projects');
                return;
            }

            const projects = responseData || [];

            if (projects.length > 0) {
                setSelectedProjectId(projects[0].id);
            }

            setProjects(projects);
            setTasks(tasks);
            setLoading(false);
        };
        callFetch();
    }, [userId, setTasks, setProjects, setSelectedProjectId, supabase]);


    useEffect(() => {
        const tasksSubscription = supabase.channel('tasks-public')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'tasks', filter: `userId=eq.${userId}` },
                (payload) => {
                    const { eventType, new: comingTask, old: prevTask } = payload;

                    let newTask = comingTask as Task;
                    let oldTask = prevTask as Task;

                    newTask.startDate = newTask.startDate ? dayjs(newTask.startDate) : undefined;
                    newTask.endDate = newTask.endDate ? dayjs(newTask.endDate) : undefined;
                    newTask.completedDate = newTask.completedDate ? dayjs(newTask.completedDate) : null;

                    changeTask(eventType, newTask as Task, oldTask as Task);
                }
            )
            .subscribe();

        const dependencyChangesSubscription = supabase.channel('dependencies-public')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'task_dependencies' },
                (payload) => {
                    const { eventType, new: newDependency, old: oldDependency } = payload;
                    const dependency: TaskDependencyRecord = newDependency as TaskDependencyRecord;
                    const oldDependencyData: TaskDependencyRecord = oldDependency as TaskDependencyRecord;

                    const isTaskOwnedByUser = (taskId: number) => {
                        return tasks.some(task => task.id === taskId && task.userId === userId);
                    };
                    if (dependency && (isTaskOwnedByUser(dependency.taskId) || eventType === 'DELETE')) {
                        changeDependency(eventType, dependency, oldDependencyData);
                    }
                }
            )
            .subscribe();

        const projectsSubscription = supabase.channel('projects-public')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'projects', filter: `userId=eq.${userId}` },
                (payload) => {
                    const { eventType, new: comingProject, old: prevProject } = payload;

                    const newProject = comingProject as Project;
                    const oldProject = prevProject as Project;

                    changeProject(eventType, newProject, oldProject);
                }
            )
            .subscribe();
        return () => {
            supabase.removeChannel(tasksSubscription);
            supabase.removeChannel(dependencyChangesSubscription);
            supabase.removeChannel(projectsSubscription);
        };
    }, [supabase, tasks, changeTask, changeDependency, userId, changeProject]);

    const handleOnDragEnd = async (event: DragEndEvent) => {
        let columnId = event.over?.id as undefined | string | null;
        const taskId = event.active.id as string;
        const taskColumnId = event.active.data.current?.columnId;

        if (columnId === taskColumnId) return;

        if (!columnId) {
            columnId = null
        }

        const taskIndex = tasks.findIndex((task, index) => task.id === parseInt(taskId))
        if (taskIndex === -1) return;

        const originalTask = tasks[taskIndex];

        const updatedTasks = [...tasks]
        const updatedTask = { ...updatedTasks[taskIndex], columnId: parseInt(columnId!) };
        //Check if the task is being moved to the completed column
        if (parseInt(columnId!) === COMPLETED_COLUMN) {
            updatedTask.completed = true;
            updatedTask.completedDate = dayjs();
        } else {
            updatedTask.completed = false;
            updatedTask.completedDate = null;
        }

        updatedTasks[taskIndex] = updatedTask;
        setTasks(updatedTasks);
        let { error } = await addOrUpdateTask(JSON.parse(JSON.stringify(updatedTask)));
        //If there is an error, revert the changes
        if (error) {
            updatedTasks[taskIndex] = originalTask;
            setTasks(updatedTasks);
        }
    };

    const handleRemoveTask = async () => {
        if (!selectedTaskId) return;
        const { error } = await deleteTask(selectedTaskId);
        if (error) {
            toast.error('Error deleting task');
        } else {
            toast.success('Task deleted successfully');
        }
        setIsDeleteDialogOpen(false);
    };

    const handleAddTask = async (args: { columnId: number | null }) => {
        setSelectedTaskId(null);
        setSelectedColumnId(args.columnId);
        setIsAddDialogOpen(true);
    };

    const taskColumns = useMemo(() => {
        const filteredTasks = tasks.filter(task => task.projectId === selectedProjectId);

        const taskColumns = columns.map(column => {
            const columnTasks = filteredTasks.filter(task => task?.columnId === column.id) || []
            return {
                ...column,
                tasks: columnTasks
            }
        });

        if (!filteredTasks.length) {
            return {
                unassignedColumn: [],
                columns: taskColumns
            };
        }

        const unassignedColumn = filteredTasks.filter(task => !task.columnId);

        return {
            unassignedColumn,
            columns: taskColumns
        };
    }, [columns, tasks, selectedProjectId]);

    if (loading) {
        return (
            <section className='h-full flex-1'>
                <div className='relative flex flex-col w-full h-full'>
                    <div className='w-full h-[100%] flex flex-row p-8 overflow-x-auto horizontal-scroll'>
                        <KanbanColumnSkeleton />
                        {columns.map(column => (
                            <KanbanColumnSkeleton key={column.id} />
                        ))}
                    </div>
                </div>
            </section>
        )
    }

    return (
        <>
            {
                projects.length > 0 ? (
                    <KanbanBoardContainer>
                        <KanbanBoard onDragEnd={handleOnDragEnd}>
                            <KanbanColumn id="unassigned" title={"Unassigned"} count={taskColumns.unassignedColumn.length || 0} onAddClick={() => handleAddTask({ columnId: null })}>
                                {taskColumns.unassignedColumn.map(task => (
                                    <KanbanTask key={task.id} id={task.id} data={{ ...task, columnId: 'unassigned' }} >
                                        <KanbanTaskCardMemo {...task} />
                                    </KanbanTask>
                                ))}
                                {!taskColumns.unassignedColumn.length && (
                                    <NoTasks />
                                )}
                            </KanbanColumn>
                            {taskColumns.columns.map(column => (
                                <KanbanColumn key={column.id} id={column.id!.toString()} title={column.title} count={column.tasks.length} onAddClick={() => handleAddTask({ columnId: column.id! })}>
                                    {column.tasks.map(task => (
                                        <KanbanTask key={task.id} id={task.id} data={{ ...task, columnId: column.id!.toString() }}>
                                            <KanbanTaskCardMemo {...task} />
                                        </KanbanTask>
                                    ))}
                                    {!column.tasks.length && (
                                        <NoTasks />
                                    )}
                                </KanbanColumn>
                            ))}
                        </KanbanBoard>
                    </KanbanBoardContainer>

                ) : (
                    <NoProjects />
                )
            }

            <ProjectDialog open={isProjectDialogOpen} project={selectedEditProject} />
            <DeleteProjectDialog open={isDeleteProjectDialogOpen} />
            <AddTaskDialog open={isAddDialogOpen} columnId={selectedColumnId} />
            <EditTaskDialog
                open={isEditDialogOpen}
            />
            <DeleteTaskDialog
                open={isDeleteDialogOpen}
                onClose={() => { setIsDeleteDialogOpen(false); }}
                onDelete={handleRemoveTask}
            />
        </>
    )
}

export default KanbanClientComponent