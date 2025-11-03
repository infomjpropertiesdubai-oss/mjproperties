import { supabase } from '@/lib/supabase'
import { User, AuthError } from '@supabase/supabase-js'

export interface AuthResponse {
  user: User | null
  error: AuthError | null
}

export interface SignUpData {
  email: string
  password: string
  firstName?: string
  lastName?: string
}

export interface SignInData {
  email: string
  password: string
}

// Sign up with email and password
export async function signUp({ email, password, firstName, lastName }: SignUpData): Promise<AuthResponse> {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        }
      }
    })

    return { user: data.user, error }
  } catch (error) {
    return { user: null, error: error as AuthError }
  }
}

// Sign in with email and password
export async function signIn({ email, password }: SignInData): Promise<AuthResponse> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    return { user: data.user, error }
  } catch (error) {
    return { user: null, error: error as AuthError }
  }
}

// Sign out
export async function signOut(): Promise<{ error: AuthError | null }> {
  try {
    const { error } = await supabase.auth.signOut()
    return { error }
  } catch (error) {
    return { error: error as AuthError }
  }
}

// Get current user
export async function getCurrentUser(): Promise<{ user: User | null; error: AuthError | null }> {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  } catch (error) {
    return { user: null, error: error as AuthError }
  }
}

// Reset password
export async function resetPassword(email: string): Promise<{ error: AuthError | null }> {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })
    return { error }
  } catch (error) {
    return { error: error as AuthError }
  }
}

// Update password
export async function updatePassword(password: string): Promise<{ error: AuthError | null }> {
  try {
    const { error } = await supabase.auth.updateUser({
      password: password
    })
    return { error }
  } catch (error) {
    return { error: error as AuthError }
  }
}

// Listen to auth state changes
export function onAuthStateChange(callback: (user: User | null) => void) {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(session?.user ?? null)
  })
} 