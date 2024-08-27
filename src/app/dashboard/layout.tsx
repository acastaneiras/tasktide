import { logout } from '@/actions/AuthActions'
import ThemeSwitcher from '@/components/custom/ThemeSwitcher'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { createClient } from '@/utils/supabase/server'
import { ChevronDown, LogOut, Settings, Sun } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    let isOauthUser = false
    const supabase = createClient();
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
                <div className="border-b shadow-sm">
                    <div className="flex h-16 items-center px-4 justify-between">
                        <div className="text-lg font-semibold">
                            Dashboard
                        </div>
                        <div className="flex items-center space-x-4">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant='ghost' className='flex items-center space-x-2'>
                                        {isOauthUser && (
                                            <Image
                                                src={data.user.user_metadata.picture}
                                                alt="avatar"
                                                className="w-8 h-8 rounded-full"
                                                width={32}
                                                height={32}
                                            />
                                        )}
                                        <span className="text-sm font-medium flex flex-row items-center gap-2">
                                            {isOauthUser ? data.user.user_metadata.name : data.user.email}
                                            <ChevronDown className={'h-4 w-4'} />
                                        </span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    <DropdownMenuLabel>User Settings</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuGroup>
                                        <DropdownMenuItem>
                                            <Settings className="mr-2 h-4 w-4" />
                                            <span>Profile</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuSub>
                                            <DropdownMenuSubTrigger>
                                                <Sun className="mr-2 h-4 w-4" />
                                                <span>Theme</span>
                                            </DropdownMenuSubTrigger>
                                            <ThemeSwitcher />
                                        </DropdownMenuSub>
                                    </DropdownMenuGroup>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <form action={logout} className='flex w-full '>
                                            <Button variant='link' className='w-full flex justify-start decoration-0 underline-offset-0 hover:no-underline h-auto p-0 m-0'>
                                                Logout
                                            </Button>
                                        </form>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>
                {children}
            </div>
        </main>
    )
}
