'use client';
import { addOrUpdateTask } from '@/actions/DashboardActions';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useKanbanStore } from '@/store/kanbanStore';
import { kanbanColumns } from '@/utils/kanbanColumns';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import dayjs from 'dayjs';
import { CalendarIcon, CircleHelp } from 'lucide-react';
import { Suspense, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { COMPLETED_COLUMN } from '@root/types';
import EditorComp from '@/components/EditorComponent';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

interface EditTaskDialogProps {
    open: boolean;
    onClose: () => void;
}

const FormSchema = z.object({
    title: z.string().nonempty({ message: 'Title is required' }),
    description: z.string().optional(),
    startDate: z.date().optional(),
    endDate: z.date().optional(),
    completed: z.boolean(),
    columnId: z.union([z.number().nullable(), z.string()]),
});

const EditTaskDialog = ({ open, onClose }: EditTaskDialogProps) => {
    const editorRef = useRef(null);
    const selectedTaskId = useKanbanStore((state) => state.selectedTaskId);
    const task = useKanbanStore((state) => state.getTaskById(selectedTaskId));
    const setIsEditDialogOpen = useKanbanStore((state) => state.setIsEditDialogOpen);
    const setSelectedTaskId = useKanbanStore((state) => state.setSelectedTaskId);

    const [isPending, setIsPending] = useState(false);
    const [completed, setCompleted] = useState(task?.completed ?? false);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            title: '',
            description: '',
            startDate: undefined,
            endDate: undefined,
            completed: false,
            columnId: null,
        },
    });

    const { reset } = form;
    const [selectedColumn, setSelectedColumn] = useState(
        kanbanColumns.find((col) => col.id === task?.columnId) || null
    );
    const [popoverOpen, setPopoverOpen] = useState(false);

    const handleOnClose = () => {
        setSelectedTaskId(null);
        reset();
        onClose();
    };

    useEffect(() => {
        if (task) {
            setSelectedColumn(
                kanbanColumns.find((col) => col.id === task.columnId) || null
            );
            setCompleted(task.completed ?? false);
            reset({
                title: task.title,
                description: task.description || '',
                startDate: task.startDate?.toDate(),
                endDate: task.endDate?.toDate(),
                completed: task.completed ?? false,
                columnId: task.columnId ?? null,
            });
        }
    }, [task, reset]);

    useEffect(() => {
        if (completed) {
            const completedColumn = kanbanColumns.find(col => col.id === COMPLETED_COLUMN);
            setSelectedColumn(completedColumn || null);
            form.setValue('columnId', COMPLETED_COLUMN);
        } else if (task) {
            //Revert to the task's original column if uncompleted
            const originalColumn = kanbanColumns.find(col => col.id === task.columnId);
            setSelectedColumn(originalColumn || null);
            form.setValue('columnId', task.columnId ?? null);
        }
    }, [completed, task, form]);

    const handleSave = async (data: z.infer<typeof FormSchema>) => {
        if (!task) return;

        setIsPending(true);

        const updatedTask = {
            ...task,
            title: data.title,
            description: data.description || '',
            startDate: data.startDate ? dayjs(data.startDate).toISOString() : undefined,
            endDate: data.endDate ? dayjs(data.endDate).toISOString() : undefined,
            completedDate: (completed && task.completedDate === null) ? dayjs().toISOString() : null,
            completed: data.completed,
            columnId: data.columnId === null || data.columnId === '' ? null : Number(data.columnId),
        };

        const { error } = await addOrUpdateTask(JSON.parse(JSON.stringify(updatedTask)));

        setIsPending(false);

        if (error) {
            toast.error('An error occurred while saving the task.');
        } else {
            toast.success('Task saved successfully.');
            setIsEditDialogOpen(false);
            onClose();
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOnClose}>
            <DialogContent onPointerDown={(e) => e.stopPropagation()} className='p-0'>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSave)} className="space-y-4">
                        <DialogHeader className='pt-6 px-6'>
                            <DialogTitle>{task ? 'Edit Task' : 'No Task Selected'}</DialogTitle>
                            {task && (
                                <DialogDescription>
                                    Created on: {dayjs(task.created).format('MMMM D, YYYY')}
                                </DialogDescription>
                            )}
                        </DialogHeader>
                        <Separator />
                        <ScrollArea className='modalContent flex gap-2'>
                            <div className='px-6 flex flex-col gap-3'>
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Title</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Description</FormLabel>
                                            <FormControl>
                                                <EditorComp
                                                    key={task?.id}
                                                    markdown={field.value ?? ''}
                                                    editorRef={editorRef}
                                                    onChange={(value) => field.onChange(value)}
                                                
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="flex space-x-4">
                                    <div className="w-1/2">
                                        <FormField
                                            control={form.control}
                                            name="startDate"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Start Date</FormLabel>
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <FormControl>
                                                                <Button
                                                                    variant={'outline'}
                                                                    className={cn(
                                                                        'w-full pl-3 text-left font-normal',
                                                                        !field.value && 'text-muted-foreground'
                                                                    )}
                                                                >
                                                                    {field.value ? (
                                                                        format(field.value, 'PPP')
                                                                    ) : (
                                                                        <span>Pick a date</span>
                                                                    )}
                                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                                </Button>
                                                            </FormControl>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-auto p-0" align="start">
                                                            <Calendar
                                                                mode="single"
                                                                selected={field.value}
                                                                onSelect={field.onChange}
                                                                initialFocus
                                                            />
                                                        </PopoverContent>
                                                    </Popover>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="w-1/2">
                                        <FormField
                                            control={form.control}
                                            name="endDate"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>End Date</FormLabel>
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <FormControl>
                                                                <Button
                                                                    variant={'outline'}
                                                                    className={cn(
                                                                        'w-full pl-3 text-left font-normal',
                                                                        !field.value && 'text-muted-foreground'
                                                                    )}
                                                                >
                                                                    {field.value ? (
                                                                        format(field.value, 'PPP')
                                                                    ) : (
                                                                        <span>Pick a date</span>
                                                                    )}
                                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                                </Button>
                                                            </FormControl>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-auto p-0" align="start">
                                                            <Calendar
                                                                mode="single"
                                                                selected={field.value}
                                                                onSelect={field.onChange}
                                                                initialFocus
                                                            />
                                                        </PopoverContent>
                                                    </Popover>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                                <FormField
                                    control={form.control}
                                    name="columnId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Column</FormLabel>
                                            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        className="w-full justify-start"
                                                        onClick={() => !completed && setPopoverOpen(true)}
                                                        disabled={completed}
                                                    >
                                                        {selectedColumn ? (
                                                            <>
                                                                <selectedColumn.icon className="mr-2 h-4 w-4 shrink-0" />
                                                                {selectedColumn.title}
                                                            </>
                                                        ) : (
                                                            <>
                                                                <CircleHelp className="mr-2 h-4 w-4 shrink-0" /> Unassigned
                                                            </>
                                                        )}
                                                    </Button>
                                                </PopoverTrigger>
                                                {!completed && (
                                                    <PopoverContent className="p-0" align="center">
                                                        <Command>
                                                            <CommandInput placeholder="Change column..." />
                                                            <CommandList>
                                                                <CommandEmpty>No results found.</CommandEmpty>
                                                                <CommandGroup>
                                                                    <CommandItem
                                                                        value="null"
                                                                        onSelect={() => {
                                                                            setSelectedColumn(null);
                                                                            field.onChange(null);
                                                                            setPopoverOpen(false);
                                                                        }}
                                                                    >
                                                                        <CircleHelp className="mr-2 h-4 w-4 opacity-40" />
                                                                        Unassigned
                                                                    </CommandItem>
                                                                    {kanbanColumns.map((column) => (
                                                                        <CommandItem
                                                                            key={column.id}
                                                                            value={column.id ? column.id.toString() : ''}
                                                                            onSelect={(value: any) => {
                                                                                const selected = kanbanColumns.find(col => col.id!.toString() === value);
                                                                                setSelectedColumn(selected || null);
                                                                                field.onChange(selected?.id ?? null);
                                                                                setPopoverOpen(false);
                                                                                if (selected?.id === COMPLETED_COLUMN) {
                                                                                    setCompleted(true);
                                                                                    form.setValue('completed', true);
                                                                                }
                                                                            }}
                                                                        >
                                                                            <column.icon className="mr-2 h-4 w-4 opacity-40" />
                                                                            <span>{column.title}</span>
                                                                        </CommandItem>
                                                                    ))}
                                                                </CommandGroup>
                                                            </CommandList>
                                                        </Command>
                                                    </PopoverContent>
                                                )}
                                            </Popover>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <ScrollBar orientation='vertical' />
                        </ScrollArea>
                        <Separator />
                        <DialogFooter className='gap-4 flex-col sm:gap-2 pb-6 px-6'>
                            <FormField
                                control={form.control}
                                name="completed"
                                render={({ field }) => (
                                    <FormItem className="flex items-center space-x-2 space-y-0 mr-auto">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={(checked) => {
                                                    setCompleted(checked === "indeterminate" ? false : checked);
                                                    field.onChange(checked);
                                                }}
                                            />
                                        </FormControl>
                                        <FormLabel className='m-0'>Completed</FormLabel>
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" disabled={isPending} className={cn(isPending && "opacity-50 cursor-not-allowed")}>
                                {isPending ? "Saving..." : "Save"}
                            </Button>
                            <DialogClose asChild>
                                <Button variant="outline" onClick={handleOnClose} disabled={isPending}>
                                    Cancel
                                </Button>
                            </DialogClose>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default EditTaskDialog;
