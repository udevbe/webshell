import { Container, TextField, Typography } from '@material-ui/core'
import React, { FormEventHandler } from 'react'
import Logo from '../components/Logo'
import { useSupabase } from '../SupaBaseContext'
import { Link, Redirect } from 'react-router-dom'

const Login = () => {
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

  if (supabase.auth.user()) {
    // already logged in
    return <Redirect to='/' />
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
      <input type='submit' hidden formTarget='log-in' />
    </form>
  )
}

export const LoginPage = () => {
  return (
    <>
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
        <Login />
      </Container>
      <Link
        style={{
          margin: 40,
          float: 'right',
        }}
        to='/resetpassword'
      >
        I forgot.
      </Link>
    </>
  )
}
