'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { z } from 'zod';
import { useKanbanStore } from '@/store/kanbanStore';
import { Domain } from 'domain';
import { DialogDescription } from '@radix-ui/react-dialog';

interface ProfileDialogProps {
  open: boolean;
}

const FormSchema = z.object({
  currentPassword: z.string().nonempty({ message: 'Current password is required' }),
  newPassword: z.string().min(8, { message: 'New password must be at least 8 characters' }),
  confirmPassword: z.string().nonempty({ message: 'Confirm password is required' }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  path: ['confirmPassword'],
  message: 'Passwords do not match',
});

const ProfileDialog = ({ open }: ProfileDialogProps) => {
  const [isPending, setIsPending] = useState(false);
  const userEmail = "test@test.com";
  const { setIsOpenProfileDialog } = useKanbanStore();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const { reset } = form;

  const handleClose = () => {
    setIsOpenProfileDialog(false);
    reset();
  };

  const handleSave = async (data: z.infer<typeof FormSchema>) => {
    setIsPending(true);
    // Simulate a password update call
    const success = await new Promise<boolean>((resolve) =>
      setTimeout(() => resolve(true), 1500)
    );

    setIsPending(false);

    if (!success) {
      toast.error('An error occurred while changing the password.');
    } else {
      toast.success('Password updated successfully.');
      handleClose();
    }
  };

  useEffect(() => {
    return () => {
      reset();
      setIsOpenProfileDialog(false);
    };
  }, [reset, setIsOpenProfileDialog]);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Profile</DialogTitle>
          <DialogDescription/>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSave)} className="space-y-4">
            <div>
              <FormLabel>Email</FormLabel>
              <Input value={userEmail} readOnly />
            </div>
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="flex-col sm:gap-2">
              <Button type="submit" disabled={isPending} className={isPending ? 'opacity-50' : ''}>
                {isPending ? 'Saving...' : 'Save'}
              </Button>
              <DialogClose asChild>
                <Button variant="outline" onClick={handleClose} disabled={isPending}>
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

export default ProfileDialog;
