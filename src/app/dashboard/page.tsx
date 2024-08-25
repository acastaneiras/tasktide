
'use client'
import KanbanBoard from '@/components/custom/kanban/KanbanBoard'
import KanbanBoardContainer from '@/components/custom/kanban/KanbanBoardContainer'

import KanbanColumn from '@/components/custom/kanban/KanbanColumn'
import KanbanTask from '@/components/custom/kanban/KanbanTask'
import { createClient } from '@/utils/supabase/client'
import { useEffect, useMemo, useState } from 'react'
import { Column, Task } from './types'
import KanbanTaskCard from '@/components/custom/kanban/KanbanTaskCard'

export default function TasksPage() {
  const supabase = createClient();

  const [columns, setColumns] = useState<Column[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);


  useEffect(() => {
    //Function to fetch tasks
    const fetchTasks = async () => {
      const { data } = await supabase
        .from('tasks')
        .select('*')
      const tasks = data as Task[]
      setTasks(tasks)
    }

    //Function to fetch columns
    const fetchColumns = async () => {
      const { data } = await supabase
        .from('columns')
        .select('*')
      const columns = data as Column[]
      setColumns(columns)
    }

    //Subscribe to changes in the tasks table
    const tasksSubscription = supabase.channel('tasks-public')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'tasks' },
        (payload) => {
          console.log('Change received!', payload)
        }
      )
      .subscribe()

    fetchTasks();
    fetchColumns();

    //Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(tasksSubscription)
    }
  }, [supabase])

  const taskColumns = useMemo(() => {
    console.log("tasks", tasks)
    console.log("columns", columns)
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

  console.log("unassigned", taskColumns)


  const handleAddTask = async (args: { columnId: string }) => { };


  return (
    <section className='h-full flex flex-1'>
      <KanbanBoardContainer>
        <KanbanBoard>
          <KanbanColumn id="unassigned" title={"Unassigned"} count={taskColumns.unassignedColumn.length || 0} onAddClick={() => handleAddTask({ columnId: 'unassigned' })}>
            {taskColumns.unassignedColumn.map(task => (
              <KanbanTask key={task.id} id={task.id} data={{ ...task, columnId: 'unassigned' }} >
                <KanbanTaskCard {...task} />
              </KanbanTask>
            ))}
          </KanbanColumn>
        </KanbanBoard>
      </KanbanBoardContainer>
    </section>
  )
}