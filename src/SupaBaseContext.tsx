import React, { useEffect, useState, createContext, useContext, ReactElement } from 'react'
import { SupabaseClient, Session, User, createClient, AuthChangeEvent } from '@supabase/supabase-js'

const supabaseURL = process.env['REACT_APP_SUPABASE_URL']
const supabaseKey = process.env['REACT_APP_SUPABASE_KEY']

if (supabaseURL === undefined || supabaseKey === undefined) {
  throw new Error('Bug. supbase url and key should be defined')
}

export interface SupabaseContext {
  session: Session | null
  authChange: AuthChangeEvent | null
  supabase: SupabaseClient
}

const navigationType = new URLSearchParams(window.location.hash).get('type') as NavigationType | null
const supabase = createClient(supabaseURL, supabaseKey)

console.log(`navigation type: ${navigationType}`)

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const supabaseContext = createContext<SupabaseContext>({
  session: null,
  authChange: null,
  supabase,
})

export const SupabaseContextProvider = (props: { children: ReactElement }) => {
  const [session, setSession] = useState<Session | null>(null)
  const [authChange, setAuthChange] = useState<AuthChangeEvent | null>(null)

  useEffect(() => {
    const session = supabase.auth.session()
    setSession(session)
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session)
      setAuthChange(event)
    })

    return () => {
      authListener?.unsubscribe()
    }
  }, [])

  const value = {
    session,
    authChange,
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
