import { Toolbar } from '@material-ui/core'
import AppBar from '@material-ui/core/AppBar'
import { makeStyles } from '@material-ui/core/styles'
import React, { FunctionComponent, ReactElement } from 'react'

const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: theme.palette.background.default,
    width: '100%',
    height: '100%',
  },
}))

export const Page: FunctionComponent<{ header: ReactElement }> = ({ children, header }) => {
  const classes = useStyles()

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <AppBar position='static' color='default' variant='outlined'>
        <Toolbar variant='dense'>{header}</Toolbar>
      </AppBar>
      <div className={classes.container}>{children}</div>
    </div>
  )
}
