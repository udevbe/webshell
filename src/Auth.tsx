import { Button, Container, TextField, Typography } from '@material-ui/core'
import React, { FormEventHandler, ReactElement } from 'react'
import Logo from './Logo'
import { useSupabase } from './SupaBaseContext'

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

export const ChangePasswordScreen = () => {
  const { supabase } = useSupabase()

  const resetSubmitted: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const password = event.target[0].value
    supabase.auth
      .update({ password })
      .then(() => {
        // TODO show user feedback
      })
      .catch((err) => {
        // TODO show user feedback
      })
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
      <form
        id='log-in'
        onSubmit={resetSubmitted}
        autoComplete='off'
        style={{
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <TextField
          helperText='enter your new password'
          label='New Password'
          type='password'
          name='password'
          size='small'
        />
        <input type='submit' hidden />
      </form>
    </Container>
  )
}

export const PasswordResetScreen = () => {
  const { supabase } = useSupabase()

  const resetSubmitted: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const email = event.target[0].value
    supabase.auth.api
      .resetPasswordForEmail(email)
      .then(() => {
        // TODO show user feedback
      })
      .catch((err) => {
        // TODO show user feedback
      })
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
      <form
        id='password-reset'
        onSubmit={resetSubmitted}
        autoComplete='off'
        style={{
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <TextField helperText='reset password' label='Email' type='email' name='email' size='small' />
        <input type='submit' hidden />
      </form>
    </Container>
  )
}

export const LoginScreen = () => {
  const { supabase } = useSupabase()
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
    <form
      id='log-in'
      onSubmit={logInSubmitted}
      autoComplete='off'
      style={{
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <TextField label='Email' type='email' name='email' size='medium' />
      <TextField label='Password' type='password' name='password' size='medium' />
      <input type='submit' hidden />
    </form>
  )
}

export const AuthOptionsScreen = () => {
  return (
    <Container
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '75vh',
      }}
    >
      <Logo />
      <div
        style={{
          margin: 40,
        }}
      />
      <LoginScreen />
      <Typography
        style={{
          margin: 40,
        }}
      >
        or
      </Typography>
      <PasswordResetScreen />
    </Container>
  )
}

export const Auth = (props: { children: ReactElement }) => {
  const { user, navigationType, authChange } = useSupabase()
  if (user) {
    if (navigationType === 'invite' || authChange === 'PASSWORD_RECOVERY') {
      return (
        <Container
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '75vh',
          }}
        >
          <Logo />
          <div
            style={{
              margin: 40,
            }}
          />
          <ChangePasswordScreen />
        </Container>
      )
    }
    return props.children
  }
  return <AuthOptionsScreen />
}
