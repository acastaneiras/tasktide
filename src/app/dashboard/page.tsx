'use server'
import KanbanClientComponent from '@/src/components/custom/kanban/KanbanClientComponent'
import { createClient } from '@/src/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function TasksPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/sign-in')
  }
  return (

    <section className='h-full flex flex-1 bg-slate-50  dark:bg-foreground/5'>
      <KanbanClientComponent userId={user?.id!} />
    </section>
  )

}