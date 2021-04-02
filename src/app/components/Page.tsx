import { Toolbar, AppBar } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import React, { FunctionComponent, ReactElement } from 'react'
import { PageDrawer } from './PageDrawer'

const useStyles = makeStyles((theme) => ({
  page: {
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    backgroundColor: theme.palette.background.default,
    flex: 1,
  },
}))

export const Page: FunctionComponent<{ header: ReactElement }> = ({ children, header }) => {
  const classes = useStyles()
  return (
    <div className={classes.page}>
      <AppBar position='static' color='default' variant='outlined'>
        <Toolbar variant='dense'>
          <PageDrawer />
          {header}
        </Toolbar>
      </AppBar>
      <div className={classes.content}>{children}</div>
    </div>
  )
}
