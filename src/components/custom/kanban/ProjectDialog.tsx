import { addOrUpdateProject } from '@/actions/DashboardActions';
import { Button } from '@/components/ui/button';
import { ColorPicker } from '@/components/ui/color-picker';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useKanbanStore } from '@/store/kanbanStore';
import { hslToHex } from '@/utils/functions';
import { useMediaQuery } from '@/utils/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@root/lib/utils';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const projectSchema = z.object({
    name: z.string().min(1, "Project name is required"),
    color: z.string().optional(),
});

type ProjectDialogProps = {
    open: boolean;
    project?: { id?: number; name: string; color: string } | null;
};

const ProjectDialog = ({ open, project }: ProjectDialogProps) => {
    const isDesktop = useMediaQuery("(min-width: 768px)");
    const [projectColor, setProjectColor] = useState("hsl(var(--primary))");
    const [isPending, setIsPending] = useState(false);
    const { setIsProjectDialogOpen, setSelectedEditProject } = useKanbanStore();

    const form = useForm<z.infer<typeof projectSchema>>({
        resolver: zodResolver(projectSchema),
        defaultValues: {
            name: project?.name || '',
            color: project?.color || 'hsl(var(--primary))',
        },
    });

    const { handleSubmit, reset, setValue, formState: { errors } } = form;

    const handleSave = async (data: z.infer<typeof projectSchema>) => {
        setIsPending(true);

        const projectData = {
            id: project?.id,
            ...data,
        };

        const { error } = await addOrUpdateProject(JSON.parse(JSON.stringify(projectData)));
        if (error) {
            toast.error("Failed to save project");
        } else {
            toast.success(project?.id ? "Project updated successfully" : "Project created successfully");
            onClose();
        }
        setIsPending(false);
    };

    const onClose = () => {
        setIsProjectDialogOpen(false);
        setIsPending(false);
        reset();
    };

    useEffect(() => {
        if (open) {
            const rootStyles = getComputedStyle(document.documentElement);
            const primaryColor = rootStyles.getPropertyValue('--primary');
            const [h, s, l] = primaryColor.replaceAll("%", "").split(' ').map(Number);
            const hexColor = hslToHex(h, s, l);
    
            setProjectColor(project?.color || hexColor);
            reset({
                name: project?.name || '',
                color: project?.color || hexColor,
            });
        }
    }, [open, project, reset, setValue]);

    const dialogContent = (
        <ScrollArea className='flex gap-2'>
            <div className="px-6 flex flex-col gap-3">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Project Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Project Name" {...field} required />
                            </FormControl>
                            {errors.name && <FormMessage>{errors.name.message}</FormMessage>}
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="color"
                    render={() => (
                        <FormItem>
                            <FormLabel>Color (optional)</FormLabel>
                            <FormControl>
                                <ColorPicker
                                    value={projectColor}
                                    onChange={(color) => {
                                        setProjectColor(color);
                                        setValue('color', color);
                                    }}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
            </div>
        </ScrollArea>
    );

    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={onClose}>
                <DialogContent className="p-0">
                    <DialogHeader className="px-6 pt-6">
                        <DialogTitle>{project ? 'Edit Project' : 'Add New Project'}</DialogTitle>
                    </DialogHeader>
                    <DialogDescription className="px-6">
                        {project ? 'Edit the details of your project below.' : 'Fill out the information below to create a new project.'}
                    </DialogDescription>
                    <Separator />
                    <Form {...form}>
                        <form onSubmit={handleSubmit(handleSave)} className="space-y-4">
                            {dialogContent}
                            <Separator />
                            <DialogFooter className='gap-4 flex-col sm:gap-2 pb-6 px-6'>
                                <Button type="submit" disabled={isPending} className={cn(isPending && "opacity-50 cursor-not-allowed")}>
                                    {isPending ? "Saving..." : "Save"}
                                </Button>
                                <DialogClose asChild>
                                    <Button variant="outline" onClick={onClose} disabled={isPending}>
                                        Cancel
                                    </Button>
                                </DialogClose>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Drawer open={open} onOpenChange={onClose}>
            <DrawerContent className="max-w-full p-0">
                <DrawerHeader className="pt-6 px-6">
                    <DrawerTitle className='flex flex-col items-center gap-2'>
                        {project ? 'Edit Project' : 'Add New Project'}
                    </DrawerTitle>
                </DrawerHeader>
                <Separator />
                <Form {...form}>
                    <form onSubmit={handleSubmit(handleSave)} className="px-6 py-6 space-y-4">
                        {dialogContent}
                    </form>
                </Form>
                <Separator />
                <DrawerFooter className='gap-4 flex-col sm:gap-2 pb-6 px-6'>
                    <Button type="submit" disabled={isPending} className={cn(isPending && "opacity-50 cursor-not-allowed")}>
                        {isPending ? "Saving..." : "Save"}
                    </Button>
                    <DrawerClose asChild>
                        <Button variant="outline" onClick={onClose} disabled={isPending}>Cancel</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
};

export default ProjectDialog;
