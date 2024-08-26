
'use client'
import KanbanBoard from '@/components/custom/kanban/KanbanBoard'
import KanbanBoardContainer from '@/components/custom/kanban/KanbanBoardContainer'
import KanbanColumn from '@/components/custom/kanban/KanbanColumn'
import KanbanTask from '@/components/custom/kanban/KanbanTask'
import { KanbanTaskCardMemo } from '@/components/custom/kanban/KanbanTaskCard'
import { kanbanColumns } from '@/utils/kanbanColumns'
import { createClient } from '@/utils/supabase/client'
import { useEffect, useMemo, useState } from 'react'
import { Column, Task } from '../../../types'
import KanbanAddButton from '@/components/custom/kanban/KanbanAddButton'
import { Skeleton } from "@/components/ui/skeleton"
import { set } from 'zod'
import KanbanColumnSkeleton from '@/components/custom/kanban/KanbanColumnSkeleton'


export default function TasksPage() {
  const supabase = createClient();

  const [columns, setColumns] = useState<Column[]>(kanbanColumns);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    //Function to fetch tasks
    const fetchTasks = async () => {
      setLoading(true)
      const { data } = await supabase
        .from('tasks')
        .select('*')
      const tasks = data as Task[]
      setTasks(tasks)
      setLoading(false)
    }

    /*//Subscribe to changes in the tasks table
    const tasksSubscription = supabase.channel('tasks-public')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'tasks' },
        (payload) => {
          console.log('Change received!', payload)
        }
      )
      .subscribe()*/

    fetchTasks();

    //Cleanup subscription on unmount
    return () => {
      //supabase.removeChannel(tasksSubscription)
    }
  }, [supabase])

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
    <section className='h-full flex flex-1'>
      <KanbanBoardContainer>
        <KanbanBoard>
          <KanbanColumn id="unassigned" title={"Unassigned"} count={taskColumns.unassignedColumn.length || 0} onAddClick={() => handleAddTask({ columnId: 'unassigned' })}>
            {taskColumns.unassignedColumn.map(task => (
              <KanbanTask key={task.id} id={task.id} data={{ ...task, columnId: 'unassigned' }} >
                <KanbanTaskCardMemo {...task} />
              </KanbanTask>
            ))}

            {!taskColumns.unassignedColumn.length && (
              <KanbanAddButton onClick={() => handleAddTask({ columnId: 'unassigned' })} />
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
                <KanbanAddButton onClick={() => handleAddTask({ columnId: column.id!.toString() })} />
              )}
            </KanbanColumn>
          ))}
        </KanbanBoard>
      </KanbanBoardContainer>
    </section>
  )
}