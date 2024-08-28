import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useKanbanStore } from '@/store/kanbanStore';

type DeleteTaskDialogProps = {
    open: boolean;
    onClose: () => void;
    onDelete: () => void;
};

const DeleteTaskDialog = ({ open, onClose, onDelete }: DeleteTaskDialogProps) => {
    const selectedTaskId = useKanbanStore((state) => state.selectedTaskId);
    const task = useKanbanStore((state) => state.getTaskById(selectedTaskId));

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
                <DialogFooter>
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
};

export default DeleteTaskDialog;
