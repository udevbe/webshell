import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { Auth } from '@supabase/ui'
import { CompositorSession } from 'greenfield-compositor'
import React from 'react'
import { App } from './App'

// Create a single supabase client for interacting with your database
const supabaseUrl = 'https://sjvjldvibbvxyvnjqipe.supabase.co'
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY || ''
const supabase = createClient(supabaseUrl, supabaseKey)

const Container = (props: { supabaseClient: SupabaseClient; compositorSession: CompositorSession }) => {
  const { user } = Auth.useUser()
  if (user) {
    return <App compositorSession={props.compositorSession} supabaseClient={props.supabaseClient} />
  } else {
    return (
      <div style={{ padding: 10 }}>
        <Auth supabaseClient={supabase} />
      </div>
    )
  }
}

export const ShellAuth = (props: { compositorSession: CompositorSession }) => (
  <Auth.UserContextProvider supabaseClient={supabase}>
    <Container supabaseClient={supabase} compositorSession={props.compositorSession} />
  </Auth.UserContextProvider>
)
