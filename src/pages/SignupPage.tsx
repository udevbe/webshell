import { Button, TextField } from '@material-ui/core'
import React, { FormEventHandler } from 'react'
import { useSupabase } from '../SupaBaseContext'

export const SignupScreen = () => {
  const { supabase } = useSupabase()

  const signUpSubmitted: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const email = event.target[0].value
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const password = event.target[1].value

    supabase.auth.signUp({ email, password }).catch((err) => alert(err.message))
  }

  return (
    <form
      id='sign-up'
      onSubmit={signUpSubmitted}
      autoComplete='off'
      style={{
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <TextField label='Email' type='email' name='email' size='small' />
      <TextField label='Password' type='password' name='password' size='small' />
      <Button type='submit' size='large'>
        Sign Up
      </Button>
    </form>
  )
}
