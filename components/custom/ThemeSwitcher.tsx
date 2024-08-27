"use client"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSubContent } from '@/components/ui/dropdown-menu'
import { Sun, Moon, Monitor } from 'lucide-react'
import React from 'react'
import { Button } from '@/components/ui/button'
import { useTheme } from 'next-themes'

const ThemeSwitcher = ({ className }: { className?: string }) => {
    const { setTheme } = useTheme()
    return (
        <DropdownMenuSubContent>
            <DropdownMenuItem onClick={() => setTheme("light")} className='gap-2'>
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all " /> Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")} className='gap-2'>
                <Moon className="h-[1.2rem] w-[1.2rem] transition-all scale-100 dark:rotate-0 dark:scale-100" />

                Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")} className='gap-2'>
                <Monitor className="h-[1.2rem] w-[1.2rem] scale-100 transition-allscale-100" />
                <span>
                System
                </span>
            </DropdownMenuItem>
        </DropdownMenuSubContent>

    )
}

export default ThemeSwitcher