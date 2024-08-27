'use client'
import { deleteTask } from '@/actions/DashboardActions'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { Task } from '@/types'
import { getDateColor, getDateText } from '@/utils/functions'
import dayjs from 'dayjs'
import { Clock, EllipsisVertical, Eye, Pencil, Trash } from 'lucide-react'
import { memo, useMemo } from 'react'
import { toast } from "sonner"
type BadgeTypes = "default" | "secondary" | "destructive" | "outline" | "warning" | "success" | "error" | null | undefined;

const KanbanTaskCard = ({ id, title, startDate, endDate, description, users }: Task) => {

    const editTask = () => { };
    const handleRemoveTask = async () => {
        const { error } = await deleteTask(id);
        if (error) {
            toast.error('Error deleting task');
        } else {
            toast.success('Task deleted successfully')
        }
    };
        
        
    const dropdownItems = useMemo(() => {
        return [
            {
                label: 'View task',
                icon: <Eye className='w-4 h-4' />,
                onClick: (e: any) => { e.stopPropagation() },
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
        <TooltipProvider>
            <Card className="w-full" onClick={() => editTask}>
                <CardHeader className='p-3'>
                    <CardTitle className="flex align-center justify-between">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <span className="truncate text-lg items-center  flex">{title}</span>
                            </TooltipTrigger>
                            <TooltipContent>
                                {title}
                            </TooltipContent>
                        </Tooltip>
                        <Dialog>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className='rounded-lg ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0'><EllipsisVertical className='w-4 h-4' /></Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuGroup>
                                        {dropdownItems.map(item => (
                                            <DialogTrigger key={item.label} asChild onClick={() => console.log(item)}>
                                                <DropdownMenuItem onPointerDown={(e) => { e.stopPropagation() }}
                                                    className={cn(item.classes, "flex items-center cursor-pointer gap-2")}>
                                                    {item.icon}
                                                    <span>{item.label}</span>
                                                </DropdownMenuItem>
                                            </DialogTrigger>
                                        ))}
                                    </DropdownMenuGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Are you sure you want to delete this task?</DialogTitle>
                                </DialogHeader>
                                <DialogDescription></DialogDescription>
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button variant='destructive' onClick={handleRemoveTask}>Delete</Button>
                                    </DialogClose>
                                    <DialogClose asChild>
                                        <Button variant='outline'>Cancel</Button>
                                    </DialogClose>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </CardTitle>
                </CardHeader>
                <hr />
                {description && <CardContent className='p-3'>
                    {
                        description.length >= 60 ? (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <p className="line-clamp-2">{description}</p>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <ScrollArea className='h-[150px] rounded-md p-4 text-pretty text-md'>
                                        {description}
                                    </ScrollArea>
                                </TooltipContent>
                            </Tooltip>
                        ) : (
                            <p className='line-clamp-2'>{description}</p>
                        )
                    }
                </CardContent>}

                <CardFooter className="flex justify-between items-center gap-2 p-3">
                    {dateConfig && (
                        <Badge variant={dateConfig.color} className='flex gap-1 text-xs'><Clock className='w-4 h-4' /> {dateConfig.text}</Badge>
                    )}

                    {/*ToDo - Users assigned*/}
                </CardFooter>
            </Card>
        </TooltipProvider>
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