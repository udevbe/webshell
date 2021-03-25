import { Container, TextField } from '@material-ui/core'
import React, { FormEventHandler } from 'react'
import { useHistory } from 'react-router-dom'
import { useSupabase } from '../SupaBaseContext'

export const ChangePasswordPage = () => {
  const { supabase } = useSupabase()
  const history = useHistory()

  const resetSubmitted: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const password = event.target[0].value
    supabase.auth
      .update({ password })
      .then(() => {
        // TODO show user feedback
        history.push('/')
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
        height: '75vh',
      }}
    >
      <div
        style={{
          margin: 80,
        }}
      />
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
