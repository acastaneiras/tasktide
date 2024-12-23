import { deleteProject } from '@/actions/DashboardActions';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Separator } from '@/components/ui/separator';
import { useKanbanStore } from '@/store/kanbanStore';
import { useMediaQuery } from '@/utils/hooks';
import { toast } from 'sonner';

type DeleteProjectDialogProps = {
    open: boolean;
};

const DeleteProjectDialog = ({ open }: DeleteProjectDialogProps) => {
    const { selectedEditProject, setIsDeleteProjectDialogOpen, selectedProjectId, setSelectedProjectId } = useKanbanStore();

    const isDesktop = useMediaQuery("(min-width: 768px)");

    const onClose = () => {
        setIsDeleteProjectDialogOpen(false);
    }

    const onDelete = async () => {
        if (!selectedEditProject) return;
        const { data, error } = await deleteProject(selectedEditProject.id!);
        if (error) {
            toast.error('Failed to delete project');
        } else {            
            toast.success('Project deleted successfully');
        }
        onClose();
    }

    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={onClose}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className='mt-2'>
                            {selectedEditProject ? `Are you sure you want to delete the project "${selectedEditProject.name}"?` : "No project selected"}
                        </DialogTitle>
                        <DialogDescription/>
                    </DialogHeader>
                    <DialogDescription>
                        {selectedEditProject ? "This action cannot be undone." : "Please select a project to delete."}
                    </DialogDescription>
                    <DialogFooter className='gap-2'>
                        {selectedEditProject && (
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
                        {selectedEditProject ? `Are you sure you want to delete the project "${selectedEditProject.name}"?` : "No project selected"}
                    </DrawerTitle>
                    <DrawerDescription>
                        {selectedEditProject ? "This action cannot be undone." : "Please select a project to delete."}
                    </DrawerDescription>
                </DrawerHeader>
                <Separator />
                <DrawerFooter className="gap-2">
                    {selectedEditProject && (
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

export default DeleteProjectDialog;
