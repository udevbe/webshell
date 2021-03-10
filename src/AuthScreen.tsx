import React, { FormEventHandler, MouseEventHandler, ReactElement, useState } from 'react'
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
  const [accessToken, setAccessToken] = useState('')
  const [refreshToken, setRefreshToken] = useState('')

  const signUpSubmitted: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const email = event.target[0].value
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const password = event.target[1].value

    supabase.auth
      .signUp({ email, password })
      .then((response) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        setAccessToken(response.data.access_token)
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        setRefreshToken(response.data.refresh_token)
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        alert('Logged in as ' + response.user.email)
      })
      .catch((err) => {
        alert(err.message)
      })
  }

  const logInSubmitted: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const email = event.target[0].value
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const password = event.target[1].value

    supabase.auth
      .signIn({ email, password })
      .then((response) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        setAccessToken(response.data.access_token)
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        setRefreshToken(response.data.refresh_token)
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // response.error ?
        alert('Logged in as ' + response.user.email)
      })
      .catch((err) => {
        alert(err.message)
      })
  }

  const fetchUserDetails = () => {
    alert(JSON.stringify(supabase.auth.user()))
  }

  const logoutSubmitted: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault()

    supabase.auth
      .signOut()
      .then((response) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        setAccessToken('')
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        setRefreshToken('')
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        alert('Logout successful')
      })
      .catch((err) => {
        alert(err.response.text)
      })
  }

  return (
    <div className='container'>
      <div className='section'>
        <h1>Supabase Auth Example</h1>
      </div>
      <div className='section'>
        <a href='https://github.com/supabase/supabase/tree/master/examples/javascript-auth'>View the code on GitHub</a>
      </div>
      <div className='section'>
        <form id='sign-up' onSubmit={signUpSubmitted}>
          <h3>Sign Up</h3>
          <label>Email</label>
          <input type='email' name='email' />
          <label>Password</label>
          <input type='password' name='password' />
          <input type='submit' />
        </form>
      </div>
      <div className='section'>
        <form id='log-in' onSubmit={logInSubmitted}>
          <h3>Log In</h3>
          <label>Email</label>
          <input type='email' name='email' />
          <label>Password</label>
          <input type='password' name='password' />
          <input type='submit' />
        </form>
      </div>
      <div className='section'>
        <form id='validate'>
          <h3>Access Token</h3>
          <input readOnly type='text' id='access-token' value={accessToken} />
          <small>Default expiry is 60 minutes</small>
          <h3>Refresh Token</h3>
          <input readOnly type='text' id='refresh-token' value={refreshToken} />
          <small>
            Supabase-js will use this to automatically fetch a new accessToken for you every 60 mins whilst the client
            is running
          </small>
        </form>
      </div>
      <div className='section'>
        <h3>Fetch User Details</h3>
        <button id='user-button' onClick={fetchUserDetails}>
          Fetch
        </button>
      </div>
      <div className='section'>
        <h3>Logout</h3>
        <button id='logout-button' onClick={logoutSubmitted}>
          Logout
        </button>
      </div>
    </div>
  )
}
