'use client';
import { addOrUpdateTask } from '@/src/actions/DashboardActions';
import EditorComp from '@/src/components/EditorComponent';
import { Button } from '@/src/components/ui/button';
import { Calendar } from '@/src/components/ui/calendar';
import { Checkbox } from '@/src/components/ui/checkbox';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/src/components/ui/command";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/src/components/ui/dialog';
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from '@/src/components/ui/drawer';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/src/components/ui/form';
import { Input } from '@/src/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/src/components/ui/popover';
import { ScrollArea, ScrollBar } from '@/src/components/ui/scroll-area';
import SelectBox from '@/src/components/ui/select-box';
import { Separator } from '@/src/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/src/components/ui/tooltip';
import { cn } from '@/lib/utils';;
import { useKanbanStore } from '@/src/store/kanbanStore';
import { useMediaQuery } from '@/src/utils/hooks';
import { kanbanColumns } from '@/src/utils/kanbanColumns';
import { zodResolver } from '@hookform/resolvers/zod';
import { DialogDescription } from '@radix-ui/react-dialog';
import { COMPLETED_COLUMN } from '@/types';
import { format } from 'date-fns';
import dayjs from 'dayjs';
import { CalendarIcon, CircleHelp, Info } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import DatePicker from '../DatePicker';

interface AddTaskDialogProps {
    open: boolean;
    columnId: number | null;
}

const FormSchema = z.object({
    title: z.string().nonempty({ message: 'Title is required' }),
    description: z.string().optional(),
    startDate: z.date().optional(),
    endDate: z.date().optional(),
    completed: z.boolean(),
    columnId: z.union([z.number().nullable(), z.string()]),
    dependencies: z.array(
        z.object({
            dependentTaskId: z.number(),
            dependencyType: z.enum(['blockedBy']),
        })
    ).optional(),
});

const AddTaskDialog = ({ open, columnId }: AddTaskDialogProps) => {
    const editorRef = useRef(null);
    const setIsAddDialogOpen = useKanbanStore((state) => state.setIsAddDialogOpen);
    const selectedProjectId = useKanbanStore((state) => state.selectedProjectId);

    const allTasks = useKanbanStore((state) => state.tasks);

    const [isPending, setIsPending] = useState(false);
    const [completed, setCompleted] = useState(false);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            title: '',
            description: '',
            startDate: undefined,
            endDate: undefined,
            completed: false,
            columnId: null,
            dependencies: [],
        },
    });

    const { reset } = form;
    const [selectedColumn, setSelectedColumn] = useState(
        kanbanColumns.find((col) => col.id === columnId) || null
    );
    const [popoverOpen, setPopoverOpen] = useState(false);

    const isDesktop = useMediaQuery("(min-width: 768px)");

    const handleOnClose = () => {
        setIsAddDialogOpen(false);
        reset();
    };

    useEffect(() => {
        reset({
            title: '',
            description: '',
            startDate: undefined,
            endDate: undefined,
            completed: false,
            columnId: columnId ?? null,
            dependencies: [],
        });

        setSelectedColumn(
            kanbanColumns.find((col) => col.id === columnId) || null
        );
    }, [open, reset, columnId]);

    useEffect(() => {
        if (completed) {
            const completedColumn = kanbanColumns.find(col => col.id === COMPLETED_COLUMN);
            setSelectedColumn(completedColumn || null);
            form.setValue('columnId', COMPLETED_COLUMN);
        }
    }, [completed, form]);

    const handleSave = async (data: z.infer<typeof FormSchema>) => {
        setIsPending(true);

        const newTask = {
            title: data.title,
            description: data.description || '',
            startDate: data.startDate ? dayjs(data.startDate).toISOString() : undefined,
            endDate: data.endDate ? dayjs(data.endDate).toISOString() : undefined,
            completed: data.completed,
            columnId: data.columnId === null || data.columnId === '' ? null : Number(data.columnId),
            dependencies: data.dependencies,
            projectId: selectedProjectId,
        };

        const { error } = await addOrUpdateTask(JSON.parse(JSON.stringify(newTask)));

        setIsPending(false);

        if (error) {
            toast.error('An error occurred while adding the task.');
        } else {
            toast.success('Task added successfully.');
            handleOnClose();
        }
    };

    const renderContent = () => (
        <>
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
                                    <div className='overflow-x-auto max-w-full'>
                                        <div className='w-full'>
                                            <EditorComp
                                                key={'new-task'}
                                                markdown={field.value ?? ''}
                                                editorRef={editorRef}
                                                onChange={(value) => field.onChange(value)}
                                            />
                                        </div>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex flex-col md:flex-row md:space-x-4">
                        <div className="w-full md:w-1/2">
                            <DatePicker
                                form={form}
                                name="startDate"
                                formLabel="Start Date"
                            />
                        </div>
                        <div className="w-full md:w-1/2 mt-4 md:mt-0">
                            <DatePicker
                                form={form}
                                name="endDate"
                                formLabel="End Date"
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
                                            onClick={() => setPopoverOpen(true)}
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
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="dependencies"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className='flex'>Dependencies
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Info className='ml-1 h-4 w-4' />
                                        </TooltipTrigger>
                                        <TooltipContent>Dependencies are tasks that must be completed before this task can be started.</TooltipContent>
                                    </Tooltip>
                                </FormLabel>
                                <SelectBox
                                    options={allTasks
                                        .filter((t) => t.projectId === selectedProjectId)
                                        .map((t) => ({
                                            label: t.title,
                                            value: t.id?.toString() || '',
                                        }))
                                    }
                                    value={(field.value || [])
                                        .map((dep) => dep.dependentTaskId)
                                        .filter((id) => id !== undefined && id !== null)
                                        .map((id) => id.toString())}
                                    onChange={(value) => {
                                        const valueArray = Array.isArray(value) ? value : [value];

                                        const newDependencies = valueArray
                                            .filter((v) => v)
                                            .map((v) => ({
                                                dependentTaskId: parseInt(v, 10),
                                                dependencyType: 'blockedBy',
                                            }));
                                        field.onChange(newDependencies);
                                    }}
                                    placeholder='Select dependencies'
                                    multiple
                                />
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <ScrollBar orientation='vertical' />
            </ScrollArea>
            <Separator />
        </>
    );

    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={handleOnClose}>
                <TooltipProvider>
                    <DialogContent onPointerDown={(e) => e.stopPropagation()} className='p-0'>
                        <DialogHeader className='pt-6 px-6'>
                            <DialogTitle>Add New Task</DialogTitle>
                            <DialogDescription />
                        </DialogHeader>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(handleSave)} className="space-y-4">
                                {renderContent()}
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
                </TooltipProvider>
            </Dialog>
        );
    }

    return (
        <Drawer open={open} onOpenChange={handleOnClose}>
            <TooltipProvider>
                <DrawerContent className="max-w-full">
                    <DrawerHeader className="pt-6 px-6">
                        <DrawerTitle className='flex flex-col items-center gap-2'>Add New Task</DrawerTitle>
                        <DrawerDescription />
                    </DrawerHeader>
                    <Separator />
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSave)} className="space-y-4">
                            {renderContent()}

                            <DrawerFooter className='gap-4 flex-col sm:gap-2 pb-6 px-6'>
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
                                <DrawerClose asChild>
                                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                                </DrawerClose>
                            </DrawerFooter>
                        </form>
                    </Form>
                </DrawerContent>
            </TooltipProvider>
        </Drawer>
    );
};

export default AddTaskDialog;
