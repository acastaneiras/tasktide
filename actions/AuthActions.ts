'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'
import { z } from 'zod'

const loginSchema = z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
})

const signupSchema = z.object({
    displayName: z.string().min(3, { message: 'Display name must be at least 3 characters long' }),
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
    confirmPassword: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
}).refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
})

export async function login(prev: any, formData: FormData) {
    const validatedFields = loginSchema.safeParse({
        email: formData.get('email'),
        password: formData.get('password'),
    })
    
    await new Promise(resolve => setTimeout(resolve, 1000))
    //If the fields are not valid, return the errors
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        }
    }

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword(validatedFields.data)

    //If there is an error, return the error message
    if (error) {
        return {
            message: 'Invalid email or password',
        }
    }
    redirect('/dashboard')

}

export async function signup(prev: any, formData: FormData) {
    const validatedFields = loginSchema.safeParse({
        email: formData.get('email'),
        password: formData.get('password'),
        displayName: formData.get('displayName'),
        confirmPassword: formData.get('confirmPassword'),
    });
    //If the fields are not valid, return the errors
    if (!validatedFields.success) {
        return {
            success: false,
            errors: validatedFields.error.flatten().fieldErrors,
        }
    }

    const supabase = createClient()
    const { error } = await supabase.auth.signUp(validatedFields.data)

    //If there is an error, return the error message
    if (error) {
        return {
            success: false,
            message: error.message,
        }
    }

    return {
        success: true,
        message: 'An email has been sent to you to verify your account',
    }
}

export async function logout() {
    const supabase = createClient()

    const { error } = await supabase.auth.signOut()
    console.log('yepaaa')
    if (error) {
        redirect('/error')
    }

    revalidatePath('/', 'layout')
    redirect('/')
}

export async function loginWithGoogle() {
    const url = process.env.NEXT_URL || 'http://localhost:3000'
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            queryParams: {
                access_type: 'offline',
                prompt: 'consent',
            },
            redirectTo: `${url}/auth/callback`,
        }
    })

    if (error) {
        return {
            message: 'Failed to sign in with Google',
        }
    }

    if (data?.url) {
        //Redirect URL
        redirect(data.url)
    }
}