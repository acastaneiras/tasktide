import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Separator } from '@/components/ui/separator';
import { useKanbanStore } from '@/store/kanbanStore';
import { useMediaQuery } from '@/utils/hooks';

type DeleteTaskDialogProps = {
    open: boolean;
    onClose: () => void;
    onDelete: () => void;
};

const DeleteTaskDialog = ({ open, onClose, onDelete }: DeleteTaskDialogProps) => {
    const selectedTaskId = useKanbanStore((state) => state.selectedTaskId);
    const task = useKanbanStore((state) => state.getTaskById(selectedTaskId));

    const isDesktop = useMediaQuery("(min-width: 768px)");

    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={onClose}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {task ? `Are you sure you want to delete the task "${task.title}"?` : "No task selected"}
                        </DialogTitle>
                    </DialogHeader>
                    <DialogDescription>
                        {task ? "This action cannot be undone." : "Please select a task to delete."}
                    </DialogDescription>
                    <DialogFooter className='gap-2'>
                        {task && (
                            <DialogClose asChild>
                                <Button variant='destructive' onClick={onDelete}>Delete</Button>
                            </DialogClose>
                        )}
                        <DialogClose asChild>
                            <Button variant='outline' onClick={onClose}>Cancel</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Drawer open={open} onOpenChange={onClose}>
            <DrawerContent className="max-w-full">
                <DrawerHeader>
                    <DrawerTitle>
                        {task ? `Are you sure you want to delete the task "${task.title}"?` : "No task selected"}
                    </DrawerTitle>
                    <DialogDescription>
                        {task ? "This action cannot be undone." : "Please select a task to delete."}
                    </DialogDescription>
                </DrawerHeader>
                <Separator />
                <DrawerFooter className="gap-2">
                    {task && (
                        <DrawerClose asChild>
                            <Button variant="destructive" onClick={onDelete}>
                                Delete
                            </Button>
                        </DrawerClose>
                    )}
                    <DrawerClose asChild>
                        <Button variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
};

export default DeleteTaskDialog;
