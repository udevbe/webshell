import {
  Box,
  Button,
  ClickAwayListener,
  CssBaseline,
  Divider,
  Drawer,
  Grow,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Typography,
} from '@material-ui/core'
import AppBar from '@material-ui/core/AppBar'
import IconButton from '@material-ui/core/IconButton'
import { makeStyles } from '@material-ui/core/styles'
import Toolbar from '@material-ui/core/Toolbar'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'
import MenuIcon from '@material-ui/icons/Menu'
import {
  CompositorSession,
  createCompositorRemoteAppLauncher,
  createCompositorRemoteSocket,
} from 'greenfield-compositor'
import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import { Client } from 'westfield-runtime-server'
import { CompositorScene } from './Compositor'
import Logo from './Logo'

export type RemoteApps = Record<string, { id: string; icon: string; title: string; url: string; client?: Client }>

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

export const App = ({
  compositorSession,
  remoteApps,
}: {
  compositorSession: CompositorSession
  remoteApps: RemoteApps
}) => {
  const classes = useStyles()

  const [activeApp, setActiveApp] = useState<RemoteApps[keyof RemoteApps] | null>(null)
  const activeAppRef = useRef(activeApp)
  useEffect(() => {
    activeAppRef.current = activeApp
  }, [activeApp])

  const [activeAppMenuOpen, setActiveAppMenuOpen] = useState(false)
  const activeAppButtonAnchorRef = useRef<HTMLButtonElement>(null)
  const prevActiveAppMenuOpen = useRef(activeAppMenuOpen)
  const handleActiveAppMenuToggle = () => {
    setActiveAppMenuOpen((prevOpen) => !prevOpen)
  }
  const handleActiveAppMenuClose = (event: React.MouseEvent<EventTarget>) => {
    if (activeAppButtonAnchorRef.current && activeAppButtonAnchorRef.current.contains(event.target as HTMLElement)) {
      return
    }

    setActiveAppMenuOpen(false)
  }
  // return focus to the button when we transitioned from !open -> open
  useEffect(() => {
    if (prevActiveAppMenuOpen.current && !activeAppMenuOpen) {
      activeAppButtonAnchorRef.current?.focus()
    }

    prevActiveAppMenuOpen.current = activeAppMenuOpen
  }, [activeAppMenuOpen])

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [remoteAppLauncher] = useState(() =>
    createCompositorRemoteAppLauncher(compositorSession, createCompositorRemoteSocket(compositorSession)),
  )

  const launchApp = (appId: keyof RemoteApps) => {
    const app = remoteApps[appId]
    if (app.client) {
      return
    }

    remoteAppLauncher.launchURL(new URL(app.url)).then((client) => {
      app.client = client
      client.onClose().then(() => {
        if (activeAppRef.current?.client === client) {
          setActiveApp(null)
        }
        app.client = undefined
      })
    })
  }

  const activeClient = (clientId: string) => {
    const result = Object.entries(remoteApps).find(([key, value]) => value.client?.id === clientId)
    if (result) {
      const [appId, app] = result
      setActiveApp(app)
    }
  }

  const closeActiveApp = () => activeApp?.client?.close()

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files === null) {
      return
    }
    for (const file of files) {
      const reader = new FileReader()
      const xhr = new XMLHttpRequest()
      xhr.upload.addEventListener(
        'progress',
        function (e) {
          if (e.lengthComputable) {
            const percentage = Math.round((e.loaded * 100) / e.total)
            console.log(`Uploading ${file.name} - ${percentage}`)
          }
        },
        false,
      )

      xhr.open('POST', `http://localhost/upload`)
      xhr.overrideMimeType('application/octet-stream')
      xhr.setRequestHeader('X-ORIG-FILE-NAME', file.name)
      reader.onload = (evt) => {
        if (evt.target) {
          xhr.send(evt.target.result)
        }
      }
      reader.readAsArrayBuffer(file)
    }
  }

  return (
    <CssBaseline>
      <div
        style={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundImage: 'url("./background_pattern.png")',
          backgroundRepeat: 'repeat',
        }}
      >
        <AppBar position='static' color='default' variant='outlined'>
          <Toolbar variant='dense'>
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
            {activeApp ? (
              <Box
                mt={0.25}
                mr={2}
                pr={1}
                pl={1}
                width={186}
                height={48}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Button
                  ref={activeAppButtonAnchorRef}
                  onClick={handleActiveAppMenuToggle}
                  fullWidth
                  variant='outlined'
                  size='small'
                  startIcon={
                    <img
                      src={`/apps/${activeApp.id}/${activeApp.icon}`}
                      style={{ width: 24, height: 24, marginRight: 8 }}
                    />
                  }
                  endIcon={<ArrowDropDownIcon />}
                >
                  <Typography
                    noWrap
                    align='left'
                    variant='caption'
                    style={{
                      flex: 1,
                      textTransform: 'none',
                    }}
                  >
                    {activeApp?.title ?? ''}
                  </Typography>{' '}
                </Button>
                <Popper
                  open={activeAppMenuOpen}
                  anchorEl={activeAppButtonAnchorRef.current}
                  role={undefined}
                  transition
                  disablePortal
                >
                  {({ TransitionProps, placement }) => (
                    <Grow
                      {...TransitionProps}
                      style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                    >
                      <Paper
                        style={{
                          width: 170,
                        }}
                        elevation={3}
                      >
                        <ClickAwayListener onClickAway={handleActiveAppMenuClose}>
                          <MenuList dense autoFocusItem={activeAppMenuOpen} id='menu-list-grow'>
                            <MenuItem dense component='label'>
                              Upload File
                              <input type='file' hidden multiple onChange={handleFileUpload} />
                            </MenuItem>
                            <MenuItem
                              dense
                              onClick={(event) => {
                                closeActiveApp()
                                handleActiveAppMenuClose(event)
                              }}
                            >
                              Close
                            </MenuItem>
                          </MenuList>
                        </ClickAwayListener>
                      </Paper>
                    </Grow>
                  )}
                </Popper>
              </Box>
            ) : (
              <Box
                mt={0.25}
                mr={2}
                pr={1}
                pl={1}
                width={186}
                height={48}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Typography color='textSecondary' variant='caption'>
                  No Application active
                </Typography>
              </Box>
            )}
            <Box
              mr={4}
              display='flex'
              flex={1}
              style={{
                display: 'flex',
                alignItems: 'center',
              }}
            />
          </Toolbar>
        </AppBar>
        <CompositorScene compositorSession={compositorSession} onActiveClient={activeClient} />
      </div>
    </CssBaseline>
  )
}
