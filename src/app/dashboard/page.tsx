'use client'
import { addOrUpdateTask, deleteTask } from '@/actions/DashboardActions'
import DeleteTaskDialog from '@/components/custom/kanban/DeleteTaskDialog'
import EditTaskDialog from '@/components/custom/kanban/EditTaskDialog'
import KanbanBoard from '@/components/custom/kanban/KanbanBoard'
import KanbanBoardContainer from '@/components/custom/kanban/KanbanBoardContainer'
import KanbanColumn from '@/components/custom/kanban/KanbanColumn'
import KanbanColumnSkeleton from '@/components/custom/kanban/KanbanColumnSkeleton'
import KanbanTask from '@/components/custom/kanban/KanbanTask'
import { KanbanTaskCardMemo } from '@/components/custom/kanban/KanbanTaskCard'
import NoTasks from '@/components/custom/kanban/NoTasks'
import { useKanbanStore } from '@/store/kanbanStore'
import { kanbanColumns } from '@/utils/kanbanColumns'
import { createClient } from '@/utils/supabase/client'
import { DragEndEvent } from '@dnd-kit/core'
import dayjs from 'dayjs'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { Column, Task } from '../../../types'


export default function TasksPage() {
  const supabase = createClient();
  const [columns, setColumns] = useState<Column[]>(kanbanColumns);
  const { tasks, setTasks, changeTask, isDeleteDialogOpen, isEditDialogOpen, setIsDeleteDialogOpen, setIsEditDialogOpen, selectedTaskId, setSelectedTaskId } = useKanbanStore();
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('tasks')
        .select('*');

      const tasks = (data as Task[]).map(task => ({
        ...task,
        startDate: task.startDate ? dayjs(task.startDate) : undefined,
        endDate: task.endDate ? dayjs(task.endDate) : undefined,
      }));
      setTasks(tasks);
      setLoading(false);
    };

    fetchTasks();
  }, [supabase, setTasks]);

  useEffect(() => {
    const tasksSubscription = supabase.channel('tasks-public')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'tasks' },
        (payload) => {
          const { eventType, new: comingTask, old: prevTask } = payload;

          let newTask = comingTask as Task;
          let oldTask = prevTask as Task;

          newTask.startDate = newTask.startDate ? dayjs(newTask.startDate) : undefined;
          newTask.endDate = newTask.endDate ? dayjs(newTask.endDate) : undefined;
          oldTask.startDate = oldTask.startDate ? dayjs(oldTask.startDate) : undefined;
          oldTask.endDate = oldTask.endDate ? dayjs(oldTask.endDate) : undefined;


          changeTask(eventType, newTask as Task, oldTask as Task);
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(tasksSubscription);
    };
  }, [supabase, changeTask]);

  const taskColumns = useMemo(() => {
    if (!tasks.length || !columns.length) {
      return {
        unassignedColumn: [],
        columns: []
      }
    }

    const unassignedColumn = tasks.filter(task => !task.columnId)

    const taskColumns = columns.map(column => {
      const columnTasks = tasks.filter(task => task?.columnId === column.id)
      return {
        ...column,
        tasks: columnTasks
      }
    })

    return {
      unassignedColumn,
      columns: taskColumns
    }
  }, [columns, tasks])

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
    updatedTasks[taskIndex] = updatedTask;

    setTasks(updatedTasks);
    let { error } = await addOrUpdateTask(updatedTask);
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

  if (loading) {
    return (
      <section className='h-full flex-1'>
        <KanbanBoardContainer>
          <KanbanColumnSkeleton />
          {columns.map(column => (
            <KanbanColumnSkeleton key={column.id} />
          ))}
        </KanbanBoardContainer>
      </section>
    )
  }

  return (
    <section className='h-full flex flex-1 bg-slate-50  dark:bg-foreground/5'>
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
          onClose={() => { setIsEditDialogOpen(false); }}
        />
        <DeleteTaskDialog
          open={isDeleteDialogOpen}
          onClose={() => { setIsDeleteDialogOpen(false); }}
          onDelete={handleRemoveTask}
        />
      </KanbanBoardContainer>
    </section>
  )
}