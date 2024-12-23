"use client"
import { DropdownMenuItem, DropdownMenuSubContent } from '@/components/ui/dropdown-menu'
import { Monitor, Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

const ThemeSwitcher = ({ className }: { className?: string }) => {
    const { setTheme } = useTheme()
    return (
        <DropdownMenuSubContent>
            <DropdownMenuItem onClick={() => setTheme("light")} className='gap-2 cursor-pointer'>
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all " /> Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")} className='gap-2 cursor-pointer'>
                <Moon className="h-[1.2rem] w-[1.2rem] transition-all scale-100 dark:rotate-0 dark:scale-100" />

                Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")} className='gap-2 cursor-pointer'>
                <Monitor className="h-[1.2rem] w-[1.2rem] scale-100 transition-allscale-100" />
                <span>
                System
                </span>
            </DropdownMenuItem>
        </DropdownMenuSubContent>

    )
}

export default ThemeSwitcher