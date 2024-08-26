import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { Task } from '@/types'
import { getDateColor, getDateText } from '@/utils/functions'
import dayjs from 'dayjs'
import { Clock, EllipsisVertical, Eye, Pencil, Trash } from 'lucide-react'
import { memo, useMemo } from 'react'

type BadgeTypes = "default" | "secondary" | "destructive" | "outline" | "warning" | "success" | "error" | null | undefined;

const KanbanTaskCard = ({ id, title, startDate, endDate, users }: Task) => {

    const editTask = () => { };
    const dropdownItems = useMemo(() => {
        return [
            {
                label: 'View task',
                icon: <Eye className='w-4 h-4' />,
                onClick: (e: any) => { e.stopPropagation() },
                classes: 'text-primary'
            },
            {
                label: 'Edit task',
                icon: <Pencil className='w-4 h-4' />,
                onClick: () => { },
                classes: 'text-primary'
            },
            {
                label: 'Delete task',
                icon: <Trash className='w-4 h-4' />,
                onClick: () => { },
                classes: 'text-destructive dark:hover:text-primary hover:text-white hover:bg-destructive/90 focus:bg-destructive/90 focus:text-white'
            }
        ]
    }, []);

    const dateConfig = useMemo(() => {
        if (!endDate && !startDate) return null
        let start: dayjs.Dayjs | null = null;
        let end: dayjs.Dayjs | null = null;

        if (endDate) {
            end = dayjs(endDate);
        }
        if (startDate) {
            start = dayjs(startDate);
        }

        return {
            color: end ? getDateColor({ date: end.toISOString() }) as BadgeTypes : "outline",
            text: getDateText({ start, end })
        }
    }, [startDate, endDate])


    return (
        <Card className="w-full" onClick={() => editTask}>
            <CardHeader className='pt-3'>
                <CardTitle className="flex align-center justify-between">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <span className="truncate text-lg items-center  flex">{title}</span>
                            </TooltipTrigger>
                            <TooltipContent>
                                {title}
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className='rounded-lg ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0'><EllipsisVertical className='w-4 h-4' /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuGroup>
                                {dropdownItems.map(item => (
                                    <DropdownMenuItem key={item.label} onPointerDown={(e) => { e.stopPropagation() }} onClick={(event) => {
                                        event.stopPropagation()
                                        event.preventDefault()
                                        item.onClick
                                    }} 
                                    className={cn(item.classes, "flex items-center cursor-pointer gap-2")}>
                                        {item.icon}
                                        <span>{item.label}</span>
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </CardTitle>
                <CardDescription className='flex flex-wrap items-center gap-2'>

                </CardDescription>
            </CardHeader>
            <CardContent>
            </CardContent>
            <CardFooter className="flex justify-between items-center gap-2">
                {dateConfig && (
                    <Badge variant={dateConfig.color} className='flex gap-1 text-xs'><Clock className='w-4 h-4' /> {dateConfig.text}</Badge>
                )}

                {/*ToDo - Users assigned*/}
            </CardFooter>
        </Card>
    )
}

export default KanbanTaskCard

export const KanbanTaskCardMemo = memo(KanbanTaskCard, (prevProps, nextProps) => {
    return (
        prevProps.id === nextProps.id &&
        prevProps.title === nextProps.title &&
        prevProps.startDate === nextProps.startDate &&
        prevProps.endDate === nextProps.endDate &&
        prevProps.users === nextProps.users &&
        prevProps.updated === nextProps.updated
    )
});