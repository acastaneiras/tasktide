'use client'
import { login, loginWithGoogle } from '@/src/actions/AuthActions'
import PendingButton from '@/src/components/custom/PendingButton'
import { Alert, AlertDescription, AlertTitle } from '@/src/components/ui/alert'
import { Button } from '@/src/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/src/components/ui/form'
import { Input } from '@/src/components/ui/input'
import { zodResolver } from "@hookform/resolvers/zod"
import { TriangleAlert } from "lucide-react"
import Image from 'next/image'
import Link from 'next/link'
import { useFormState } from 'react-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export default function LoginPage() {
  //Generate a form with react-hook-form
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    mode: 'onSubmit',
    defaultValues: {
      email: '',
      password: '',
    }
  });
  //Login action
  const [state, formAction] = useFormState(login, { message: '' })


  return (
    <Card className="w-full md:w-1/3">
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
        <CardDescription>to continue to TaskTide</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='flex flex-col gap-4 '>

          {state.message && (
            <Alert variant="destructive">
              <TriangleAlert className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {state.message}
              </AlertDescription>
            </Alert>
          )}
          <Button className='flex w-full justify-center gap-3 border-2 border-border' variant={`secondary`} onClick={() => loginWithGoogle()}>
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
                  <FormDescription>
                    <div className="text-right">
                      <Link href="/reset-password" className="text-sm hover:underline">
                        Forgot your password?
                      </Link>
                    </div>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <PendingButton text="Sign in" />
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <p className='text-sm'>
          You don&apos;t have an account? <Link href="/sign-up" className='hover:underline'>Sign up</Link>
        </p>
      </CardFooter>
    </Card>
  )
}