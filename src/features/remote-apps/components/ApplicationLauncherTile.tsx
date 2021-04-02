import React, { FunctionComponent } from 'react'
import { Grid, makeStyles } from '@material-ui/core'
import { RemoteApp } from '../types'
import { ApplicationLauncher } from './ApplicationLauncher'

const useStyles = makeStyles(() => ({
  root: {
    margin: 2,
  },
}))

export const ApplicationLauncherTile: FunctionComponent<{ app: RemoteApp }> = ({ app }) => {
  const classes = useStyles()
  return (
    <Grid item className={classes.root}>
      <ApplicationLauncher app={app} />
    </Grid>
  )
}
