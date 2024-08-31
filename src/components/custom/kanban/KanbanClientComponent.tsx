'use client'
import React, { useEffect, useMemo, useState } from 'react'
import DeleteTaskDialog from '@/components/custom/kanban/DeleteTaskDialog'
import EditTaskDialog from '@/components/custom/kanban/EditTaskDialog'
import KanbanBoard from '@/components/custom/kanban/KanbanBoard'
import KanbanBoardContainer from '@/components/custom/kanban/KanbanBoardContainer'
import KanbanColumn from '@/components/custom/kanban/KanbanColumn'
import KanbanTask from '@/components/custom/kanban/KanbanTask'
import { KanbanTaskCardMemo } from '@/components/custom/kanban/KanbanTaskCard'
import NoTasks from '@/components/custom/kanban/NoTasks'
import { DragEndEvent } from '@dnd-kit/core'
import { Column, COMPLETED_COLUMN, Task } from '@root/types'
import { toast } from 'sonner'
import { addOrUpdateTask, deleteTask, fetchTasks } from '@/actions/DashboardActions'
import { kanbanColumns } from '@/utils/kanbanColumns'
import { useKanbanStore } from '@/store/kanbanStore'
import { createClient } from '@/utils/supabase/client'
import dayjs from 'dayjs'
import KanbanColumnSkeleton from './KanbanColumnSkeleton'


const KanbanClientComponent = ({userId}: {userId: string}) => {
    const supabase = createClient();
    const columns = kanbanColumns as Column[];
    const { tasks, setTasks, changeTask, isDeleteDialogOpen, isEditDialogOpen, setIsDeleteDialogOpen, setIsEditDialogOpen, selectedTaskId } = useKanbanStore();
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const callFetch = async () => {
            setLoading(true);
            const {data, error} = await fetchTasks(userId);
            if (error) {
                toast.error('Error fetching tasks');
                return;
            }
            const tasks = (data as Task[]).map(task => ({
                ...task,
                startDate: task.startDate ? dayjs(task.startDate) : undefined,
                endDate: task.endDate ? dayjs(task.endDate) : undefined,
                completedDate: task.completedDate ? dayjs(task.completedDate) : null
            }));
            setTasks(tasks);
            setLoading(false);
        };
        callFetch();
    }, [userId, setTasks]);

    
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
        return () => {
            supabase.removeChannel(tasksSubscription);
        };
    }, [supabase, changeTask, userId]);

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

    const handleAddTask = async (args: { columnId: string }) => { };

    const taskColumns = useMemo(() => {
        const taskColumns = columns.map(column => {
            const columnTasks = tasks.filter(task => task?.columnId === column.id) || []
            return {
                ...column,
                tasks: columnTasks
            }
        })

        if (!tasks.length) {
            return {
                unassignedColumn: [],
                columns: taskColumns
            }
        }

        const unassignedColumn = tasks.filter(task => !task.columnId)


        return {
            unassignedColumn,
            columns: taskColumns
        }
    }, [columns, tasks])

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
        <KanbanBoardContainer>
            <KanbanBoard onDragEnd={handleOnDragEnd}>
                <KanbanColumn id="unassigned" title={"Unassigned"} count={taskColumns.unassignedColumn.length || 0} onAddClick={() => handleAddTask({ columnId: 'unassigned' })}>
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
                    <KanbanColumn key={column.id} id={column.id!.toString()} title={column.title} count={column.tasks.length} onAddClick={() => handleAddTask({ columnId: column.id!.toString() })}>
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
            <EditTaskDialog
                open={isEditDialogOpen}
            />
            <DeleteTaskDialog
                open={isDeleteDialogOpen}
                onClose={() => { setIsDeleteDialogOpen(false); }}
                onDelete={handleRemoveTask}
            />
        </KanbanBoardContainer>
    )
}

export default KanbanClientComponent