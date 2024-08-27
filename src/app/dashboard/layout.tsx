import { logout } from '@/actions/AuthActions'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { createClient } from '@/utils/supabase/server'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import { userAgent } from 'next/server'
import React from 'react'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    let isOauthUser = false
    const supabase = createClient()
    //UNCOMMENT THIS ON PRODUCTION
    /*const { data, error } = await supabase.auth.getUser()
    if (error || !data?.user) {
        redirect('/sign-in')
    } else if (data?.user.app_metadata.providers.includes('google')) {
        isOauthUser = true
    }*/
    const data = {
        user: {
            email: 'test',
            user_metadata: {
                name: 'Test User',
                picture: 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50'
            }
        }
    }
    return (
        <main className='overflow-hidden bg-background h-full'>
            <div className="flex flex-col h-full">
                <div className="border-b">
                    <div className="flex h-16 items-center px-4">
                        Dashboard
                        <div className="flex-grow">
                            <div className="flex justify-end">
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="flex items-center space-x-2 ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0" asChild>
                                        <Button variant='link' className='hover:no-underline no-underline ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0'>
                                            {
                                                isOauthUser && <Image src={data.user.user_metadata.picture} alt="avatar" className="w-8 h-8 rounded-full" width={20} height={20} />
                                            }
                                            <span>{isOauthUser ? data.user.user_metadata.name : data.user.email}</span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem>Profile</DropdownMenuItem>
                                        <DropdownMenuItem>Billing</DropdownMenuItem>
                                        <DropdownMenuItem>Team</DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <form action={logout}>
                                                <Button variant='link' className='hover:no-underline'>Logout</Button>
                                            </form></DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    </div>
                </div>
                {children}
            </div>
        </main>
    )
}
