import { Container, Snackbar, TextField } from '@material-ui/core'
import MuiAlert from '@material-ui/lab/Alert'
import React, { FormEventHandler, useState } from 'react'
import Logo from '../components/Logo'
import { useSupabase } from '../SupaBaseContext'

export const ResetPasswordPage = () => {
  const { supabase } = useSupabase()

  const [showPasswordResetSuccess, setShowPasswordResetSuccess] = useState(false)
  const handleShowPasswordResetSuccessClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return
    }
    setShowPasswordResetSuccess(false)
  }

  const resetSubmitted: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const email = event.target[0].value
    supabase.auth.api
      .resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/changepassword`,
      })
      .then(() => {
        setShowPasswordResetSuccess(true)
      })
      .catch((err) => {
        // TODO show user feedback
      })
  }

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
        <div
          style={{
            margin: 80,
          }}
        />
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
      <Snackbar open={showPasswordResetSuccess} autoHideDuration={6000} onClose={handleShowPasswordResetSuccessClose}>
        <MuiAlert elevation={6} variant='filled' onClose={handleShowPasswordResetSuccessClose} severity='success'>
          Mail sent.
        </MuiAlert>
      </Snackbar>
    </>
  )
}
