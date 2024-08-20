import { redirect } from 'next/navigation'

import { logout } from '@/actions/AuthActions'
import { Button } from '@/components/ui/button'
import { createClient } from '@/utils/supabase/server'

export default async function PrivatePage() {
  const supabase = createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/sign-in')
  }

  return (
    <div>
      <p>Hello {data.user.email}</p>
      <form action={logout}>
        <Button>Logout</Button>
      </form>
    </div>
  )
}