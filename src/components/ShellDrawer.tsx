import { Box, Divider, Drawer, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core'
import IconButton from '@material-ui/core/IconButton'
import { makeStyles } from '@material-ui/core/styles'
import MenuIcon from '@material-ui/icons/Menu'
import React, { useState } from 'react'
import Logo from './Logo'
import { RemoteApps } from '../types/webshell'

const useStyles = makeStyles((theme) => ({
  menuButton: {
    marginRight: theme.spacing(2),
  },
  appURLInput: {
    paddingTop: 6,
    paddingBottom: 6,
    textOverflow: 'ellipsis',
    fontSize: '0.875rem',
  },
}))

export const ShellDrawer = ({
  launchApp,
  remoteApps,
}: {
  launchApp: (appId: keyof RemoteApps) => void
  remoteApps: RemoteApps
}) => {
  const classes = useStyles()

  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <>
      <IconButton
        edge='start'
        className={classes.menuButton}
        color='inherit'
        aria-label='menu'
        onClick={() => setDrawerOpen(true)}
      >
        <MenuIcon />
      </IconButton>
      <Drawer anchor='left' open={drawerOpen} onClose={() => setDrawerOpen(false)} keepMounted>
        <Box mt={1} mb={1} ml={2} mr={2}>
          <Logo fontSize='3em' />
        </Box>
        <Divider />
        <List>
          {Object.entries(remoteApps).map(([appId, app]) => {
            return (
              <ListItem
                button
                onClick={() => {
                  launchApp(appId as keyof RemoteApps)
                  setDrawerOpen(false)
                }}
                key={appId}
              >
                <ListItemIcon>
                  <img src={`/apps/${appId}/${app.icon}`} style={{ width: 24, height: 24 }} />
                </ListItemIcon>
                <ListItemText primary={app.title} />
              </ListItem>
            )
          })}
        </List>
      </Drawer>
    </>
  )
}
