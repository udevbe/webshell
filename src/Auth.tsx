import { Button, Container, TextField, Typography } from '@material-ui/core'
import React, { FormEventHandler, MouseEventHandler, ReactElement } from 'react'
import Logo from './Logo'
import { useSupabase } from './SupaBaseContext'

export const Auth = (props: { children: ReactElement }) => {
  const { user } = useSupabase()
  if (user) {
    return props.children
  } else {
    return <AuthScreen />
  }
}

const AuthScreen = () => {
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

  const logInSubmitted: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const email = event.target[0].value
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const password = event.target[1].value

    supabase.auth.signIn({ email, password }).catch((err) => alert(err.message))
  }

  return (
    <Container
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Logo />
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
      <Typography
        variant='subtitle2'
        style={{
          margin: 20,
        }}
      >
        Already have an account?
      </Typography>
      <form
        id='log-in'
        onSubmit={logInSubmitted}
        autoComplete='off'
        style={{
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <TextField label='Email' type='email' name='email' size='small' />
        <TextField label='Password' type='password' name='password' size='small' />
        <Button type='submit' size='large'>
          Log in
        </Button>
      </form>
    </Container>
  )
}
