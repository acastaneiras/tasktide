"use client";
import PendingButton from '@/components/custom/PendingButton'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { createClient } from '@/utils/supabase/client'
import { zodResolver } from "@hookform/resolvers/zod"
import { TriangleAlert } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const schema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export default function UpdatePasswordPage() {
  const [state, setState] = useState({ success: false, message: '' });
  const [requestMessage, setRequestMessage] = useState<boolean | string>(false);
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: {
      password: '',
      confirmPassword: '',
    }
  });
  useEffect(() => {
    setRequestMessage(false);
    const params = new URLSearchParams(location.search || location.hash.replace('#', '?'));
    const urlError = params.get('error');
    const errorDescription = params.get('error_description');

    if (urlError) {
      setRequestMessage(decodeURIComponent(errorDescription || 'An unknown error occurred.'));
    }
  }, []);

  const handleUpdatePassword = async (data: z.infer<typeof schema>) => {
    const supabase = createClient();

    setState({ success: false, message: '' });

    const { password } = data;

    const { error } = await supabase.auth.updateUser({
      password
    });

    if (error) {
      setState({ success: false, message: error.message });
    } else {
      setState({ success: true, message: 'Password Updated Successfully.' });
    }
  }

  return (
    <Card className="w-full md:w-1/3">
      <CardHeader>
        <CardTitle className="text-3xl">Update your password</CardTitle>
        <CardDescription>Enter your new password below</CardDescription>
      </CardHeader>
      <CardContent>
        {!requestMessage ? (
          <div>
            <div className='flex flex-col gap-4 mb-4'>
              {state.message && (
                <Alert variant={state.success ? 'success' : 'destructive'}>
                  <TriangleAlert className="h-4 w-4" />
                  <AlertTitle>{state.success ? 'Success' : 'Error'}</AlertTitle>
                  <AlertDescription>{state.message}</AlertDescription>
                </Alert>
              )}
            </div>

            <Form {...form}>
              <form className="grid w-full items-center gap-4" onSubmit={form.handleSubmit(handleUpdatePassword)}>
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="flex flex-col space-y-1.5">
                      <FormLabel>New password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem className="flex flex-col space-y-1.5">
                      <FormLabel>Confirm new password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <PendingButton text="Update password" />
              </form>
            </Form>
          </div>
        ) : (
          <Alert variant="destructive" className="mb-4">
            <TriangleAlert className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{requestMessage}</AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter>
        <p className='text-sm'>
          Remember your password? <Link href="/sign-in">Sign in</Link>
        </p>
      </CardFooter>
    </Card>
  )
}
