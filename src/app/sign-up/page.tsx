'use client'
import { loginWithGoogle, signup } from '@/actions/AuthActions'
import PendingButton from '@/components/custom/PendingButton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, TriangleAlert } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useFormState } from 'react-dom'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'

const schema = z.object({
  displayName: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8),
  confirmPassword: z.string().min(8),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export default function SignUpPage() {
  //Generate a form with react-hook-form
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    mode: 'onTouched',
    defaultValues: {
      displayName: '',
      email: '',
      password: '',
      confirmPassword: '',
    }
  });

  //Signup action
  const [state, formAction] = useFormState(signup, { success: false, message: '' })

  return (
    <Card className="w-full md:w-1/3">
      <CardHeader>
        <CardTitle>Create your account</CardTitle>
        <CardDescription>to continue to TaskTide</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='flex flex-col gap-4 '>
          {(state.message) && (
            <Alert variant={state.success ? `success` : `destructive`}>
              <TriangleAlert className="h-4 w-4" />
              <AlertTitle>{state.success ? `Success!` : `Error`}</AlertTitle>
              <AlertDescription>
                {state.message}
              </AlertDescription>
            </Alert>
          )}
          <Button className='flex w-full justify-center gap-3' onClick={() => loginWithGoogle()}>
            <Image src="/google_logo.png" alt="Google logo" width={20} height={20} />
            Continue with Google
          </Button>
        </div>

        <div className="flex items-center justify-center flex-row">
          <div className="flex items-stretch justify-start h-[1px] border w-full"></div>
          <p className="text-center my-3 mx-3">or</p>
          <div className="flex items-stretch justify-start h-[1px] border w-full"></div>
        </div>
        <Form {...form}>
          <form className="grid w-full items-center gap-4" action={formAction}>
            <FormField
              control={form.control}
              name="displayName"
              render={({ field }) => (
                <FormItem className="flex flex-col space-y-1.5">
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex flex-col space-y-1.5">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="flex flex-col space-y-1.5">
                  <FormLabel>Password</FormLabel>
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
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <PendingButton text="Sign up" />
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <p className='text-sm'>
          Do you already have an account? <Link href="/sign-in">Sign in</Link>
        </p>
      </CardFooter>
    </Card>
  )
}