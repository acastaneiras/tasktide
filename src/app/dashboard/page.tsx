'use server'
import KanbanClientComponent from '@/components/custom/kanban/KanbanClientComponent'


export default async function TasksPage() {
  const userId = process.env.NEXT_PUBLIC_DEV_USER_ID as string;

  return (
    <section className='h-full flex flex-1 bg-slate-50  dark:bg-foreground/5'>
      <KanbanClientComponent userId={userId}/>
    </section>
  )
}