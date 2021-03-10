import React, { useEffect, useState, createContext, useContext, ReactElement } from 'react'
import { SupabaseClient, Session, User, createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'http://localhost:8000'
const SUPABASE_KEY =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTYwMzk2ODgzNCwiZXhwIjoyNTUwNjUzNjM0LCJhdWQiOiIiLCJzdWIiOiIiLCJSb2xlIjoicG9zdGdyZXMifQ.kdRWxJKxqgFOlx4BZQj-GIIOEeMILqUvdHMh8ebcn8M'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

export interface SupabaseContext {
  user: User | null
  session: Session | null
  supabase: SupabaseClient
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const supabaseContext = createContext<SupabaseContext>({
  user: null,
  session: null,
  supabase,
})

export const SupabaseContextProvider = (props: { children: ReactElement }) => {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const session = supabase.auth.session()
    setSession(session)
    setUser(session?.user ?? null)
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
    })

    return () => {
      authListener?.unsubscribe()
    }
  }, [])

  const value = {
    session,
    user,
    supabase,
  }
  return <supabaseContext.Provider value={value} {...props} />
}

export const useSupabase = (): SupabaseContext => {
  const context = useContext(supabaseContext)
  if (context === undefined) {
    throw new Error(`useUser must be used within a UserContextProvider.`)
  }
  return context
}
