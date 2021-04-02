import React, { FunctionComponent } from 'react'
import { Card, CardActionArea, CardMedia, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { useAppDispatch } from '../../../app/hooks'
import { Image } from '../../../app/components/Image'
import { appLaunch } from '../remoteAppsSlice'
import { RemoteApp } from '../types'

const useStyles = makeStyles({
  root: {
    // TODO increase width for bigger screen (responsive)
    width: 58,
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
  },
  appTitle: {
    paddingTop: 5,
    color: 'white',
    textStroke: 'thin rgba(0,0,0,0.3)',
  },
})

export const ApplicationLauncher: FunctionComponent<{
  app: RemoteApp
}> = ({ app }) => {
  const { icon, title, id } = app

  const dispatch = useAppDispatch()
  const onLaunchApp = (): any => dispatch(appLaunch({ app }))

  const classes = useStyles()
  return (
    <div className={classes.root}>
      <CardActionArea onClick={onLaunchApp}>
        <Card className={classes.card} key={id} elevation={3}>
          <CardMedia title={title}>
            <Image src={icon} alt={title} />
          </CardMedia>
        </Card>
        <Typography className={classes.appTitle} align='center' variant='body2' gutterBottom={false}>
          {title}
        </Typography>
      </CardActionArea>
    </div>
  )
}
