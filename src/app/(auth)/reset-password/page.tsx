'use client';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { TriangleAlert } from 'lucide-react';
import Link from 'next/link';
import {createClient} from '@/utils/supabase/client';

const schema = z.object({
    email: z.string().email(),
});

export default function ResetPasswordPage() {
    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        mode: 'onSubmit',
        defaultValues: {
            email: '',
        },
    });

    const [state, setState] = useState({ message: '', success: false });

    const handleResetPassword = async (data: z.infer<typeof schema>) => {
        const supabase = createClient();
        setState({ message: 'If an account with that email exists, you will receive a password reset link.', success: true });
        const { data: response, error } = await supabase.auth.resetPasswordForEmail(data.email, {
            redirectTo: `${window.location.origin}/update-password`,
        })
    };

    return (
        <Card className="w-full md:w-1/3 mx-auto mt-16">
            <CardHeader>
                <CardTitle>Reset Password</CardTitle>
                <CardDescription>Enter your email to reset your password</CardDescription>
            </CardHeader>
            <CardContent>
                {state.message && (
                    <div className="flex flex-col mb-6">

                        <Alert variant={state.success ? 'success' : 'destructive'}>
                            <TriangleAlert className="h-4 w-4" />
                            <AlertTitle>{state.success ? 'Success' : 'Error'}</AlertTitle>
                            <AlertDescription>{state.message}</AlertDescription>
                        </Alert>
                    </div>
                )}

                <Form {...form}>
                    <form className="grid w-full items-center gap-4" onSubmit={form.handleSubmit(handleResetPassword)}>
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem className="flex flex-col space-y-1.5">
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input type="email" placeholder="you@example.com" {...field} required />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full">
                            Send Reset Link
                        </Button>
                    </form>
                </Form>
            </CardContent>
            <CardFooter>
                <p className="text-sm">
                    Remember your password? <Link href="/sign-in" className='hover:underline'>Sign in</Link>
                </p>
            </CardFooter>
        </Card>
    );
}
