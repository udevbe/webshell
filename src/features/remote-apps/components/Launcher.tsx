import { CircularProgress, Container, Grid, IconButton, makeStyles, Menu } from '@material-ui/core'
import type { FunctionComponent, RefObject } from 'react'
import React, { useEffect, useState } from 'react'
import AppsIcon from '@material-ui/icons/Apps'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { refreshApps, selectAllApps, selectAppDisoveryLoading } from '../remoteAppsSlice'
import { ApplicationLauncherTile } from './ApplicationLauncherTile'

const useStyles = makeStyles(() => ({
  container: {
    minHeight: 100,
  },
  menuPaper: {
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  noAppsText: {
    color: 'white',
    textStroke: 'thin rgba(0,0,0,0.6)',
  },
}))

export const Launcher: FunctionComponent<{
  anchorElRef: RefObject<HTMLElement>
}> = ({ anchorElRef }) => {
  const isLoading = useAppSelector(selectAppDisoveryLoading)
  const remoteApps = useAppSelector(selectAllApps)
  const dispatch = useAppDispatch()

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const handleClick = () => setAnchorEl(anchorElRef.current)
  const handleClose = () => setAnchorEl(null)

  const open = Boolean(anchorEl)

  useEffect(() => {
    if (open) {
      dispatch(refreshApps())
    }
  }, [open])

  const classes = useStyles()
  return (
    <>
      <IconButton aria-controls='application-launcher-menu' aria-haspopup='true' onClick={handleClick}>
        <AppsIcon />
      </IconButton>
      <Menu
        id='simple-menu'
        getContentAnchorEl={null}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 0,
          horizontal: 'right',
        }}
        keepMounted
        open={open}
        onClose={handleClose}
        classes={{
          paper: classes.menuPaper,
        }}
      >
        <Container className={classes.container} maxWidth='lg' onClick={handleClose}>
          {isLoading ? (
            <CircularProgress />
          ) : (
            <Grid container spacing={2} alignItems='stretch'>
              {remoteApps.map((app) => (
                <ApplicationLauncherTile key={app.id} app={app} />
              ))}
            </Grid>
          )}
        </Container>
      </Menu>
    </>
  )
}
