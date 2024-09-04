import ReactMarkdown from 'react-markdown';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useKanbanStore } from '@/store/kanbanStore';
import { Task } from '@root/types';
import { getDateColor, getDateText } from '@/utils/functions';
import dayjs from 'dayjs';
import { Clock, EllipsisVertical, Eye, Lock, Trash } from 'lucide-react';
import { memo, useMemo } from 'react';

type BadgeTypes = "default" | "secondary" | "destructive" | "outline" | "warning" | "success" | "error" | null | undefined;

const KanbanTaskCard = ({ id, title, startDate, endDate, description, completed, completedDate, dependencies }: Task) => {
    const { setIsDeleteDialogOpen, setIsEditDialogOpen, setSelectedTaskId, isTaskBlocked } = useKanbanStore();

    const dropdownItems = useMemo(() => {
        return [
            {
                label: 'View task',
                icon: <Eye className='w-4 h-4' />,
                onClick: () => { setSelectedTaskId(id); setIsEditDialogOpen(true); },
                classes: 'text-primary'
            },
            {
                label: 'Delete task',
                icon: <Trash className='w-4 h-4' />,
                onClick: () => { setSelectedTaskId(id); setIsDeleteDialogOpen(true); },
                classes: 'text-destructive dark:hover:text-primary hover:text-white hover:bg-destructive/90 focus:bg-destructive/90 focus:text-white'
            }
        ];
    }, [setIsDeleteDialogOpen, setIsEditDialogOpen, id, setSelectedTaskId]);

    const dateConfig = useMemo(() => {
        if (!endDate && !startDate && !completedDate) return null;
        let start: dayjs.Dayjs | null = null;
        let end: dayjs.Dayjs | null = null;

        if (endDate) {
            end = dayjs(endDate);
        }
        if (startDate) {
            start = dayjs(startDate);
        }

        if (completed && completedDate !== null) return { color: "success" as BadgeTypes, text: getDateText({ start, end, completedDate }) };

        return {
            color: end ? getDateColor({ date: end.toISOString() }) as BadgeTypes : "outline",
            text: getDateText({ start, end })
        };
    }, [startDate, endDate, completed, completedDate]);

    const blockedBy = useMemo(() => {
        if (!dependencies) return [];
        const blockedBy = dependencies.filter(dep => dep.dependencyType === 'blockedBy');
        if (blockedBy.length === 0) return [];
        return isTaskBlocked(id);

    }, [dependencies]);

    return (
        <TooltipProvider>
            <Card className="w-full" onClick={() => { setSelectedTaskId(id); setIsEditDialogOpen(true); }}>
                <CardHeader className='p-3'>
                    <CardTitle className="flex items-center justify-between">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <span className="truncate text-[1.05rem]/6 inline-block align-middle h-full my-auto  max-w-52 card-title">{title}</span>
                            </TooltipTrigger>
                            <TooltipContent>
                                {title}
                            </TooltipContent>
                        </Tooltip>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className='rounded-lg ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0'>
                                    <EllipsisVertical className='w-4 h-4' />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuGroup>
                                    {dropdownItems.map(item => (
                                        <DropdownMenuItem key={item.label} onPointerDown={(e) => { e.stopPropagation(); }} onClick={(e) => { e.stopPropagation(); item.onClick(); }}
                                            className={cn(item.classes, "flex items-center cursor-pointer gap-2")}>
                                            {item.icon}
                                            <span>{item.label}</span>
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </CardTitle>
                </CardHeader>
                {dateConfig && <hr />}
                {description &&
                    <CardContent className='p-3'>
                        {
                            description.length >= 60 ? (
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div className="line-clamp-2 w-full break-all">
                                            <ReactMarkdown>{description}</ReactMarkdown>
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <ScrollArea className='h-[150px] rounded-md p-4 text-pretty text-md break-all'>
                                            <ReactMarkdown>{description}</ReactMarkdown>
                                        </ScrollArea>
                                    </TooltipContent>
                                </Tooltip>
                            ) : (
                                <div className='line-clamp-2 w-full break-all'>
                                    <ReactMarkdown>{description}</ReactMarkdown>
                                </div>
                            )
                        }
                    </CardContent>}

                {(dateConfig || blockedBy.length > 0) && (
                    <CardFooter className="flex items-center gap-2 p-3">
                        {
                            dateConfig && <Badge variant={dateConfig.color} className='flex gap-1 text-xs'><Clock className='w-4 h-4' /> {dateConfig.text}</Badge>
                        }
                        {blockedBy.length > 0 &&
                            <Tooltip>
                                <TooltipTrigger>
                                    <Badge variant="warning" className='flex gap-1 text-xs'><Lock className='w-4 h-4' /> Blocked</Badge>

                                </TooltipTrigger>
                                <TooltipContent>
                                    <>
                                        <h6 className='text-sm'>Blocked by</h6>
                                        <ul className='text-xs list-disc ml-4'>
                                            {blockedBy.map(task => (
                                                <li key={task.id}>{task.title}</li>
                                            ))}
                                        </ul>
                                    </>
                                </TooltipContent>
                            </Tooltip>
                        }
                    </CardFooter>
                )}
            </Card>
        </TooltipProvider>
    );
}

export default KanbanTaskCard;

export const KanbanTaskCardMemo = memo(KanbanTaskCard, (prevProps, nextProps) => {
    return (
        prevProps.id === nextProps.id &&
        prevProps.title === nextProps.title &&
        prevProps.startDate === nextProps.startDate &&
        prevProps.endDate === nextProps.endDate &&
        prevProps.userId === nextProps.userId &&
        prevProps.updated === nextProps.updated &&
        prevProps.dependencies === nextProps.dependencies
    );
});
