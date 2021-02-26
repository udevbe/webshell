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
  OutlinedInput,
  Paper,
  Popper,
  Typography,
} from '@material-ui/core'
import AppBar from '@material-ui/core/AppBar'
import IconButton from '@material-ui/core/IconButton'
import { createMuiTheme, makeStyles, ThemeProvider } from '@material-ui/core/styles'
import Toolbar from '@material-ui/core/Toolbar'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import MenuIcon from '@material-ui/icons/Menu'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'
import { SupabaseClient } from '@supabase/supabase-js'
import {
  CompositorSession,
  createCompositorRemoteAppLauncher,
  createCompositorRemoteSocket,
  createCompositorWebAppLauncher,
  createCompositorWebAppSocket,
} from 'greenfield-compositor'
import React, { useEffect, useRef, useState } from 'react'
import { Client } from 'westfield-runtime-server'
import { CompositorScene } from './Compositor'
import Logo from './Logo'

const apps: Record<
  string,
  { id: string; icon: string; title: string; type: 'web' | 'remote'; url: string; client?: Client }
> = {
  ['react-canvaskit']: {
    id: 'react-canvaskit',
    icon: 'icon.svg',
    title: 'React CanvasKit',
    type: 'web',
    url: `${window.location.origin}/apps/react-canvaskit/app.js`,
  },
  ['remote-gtk3-demo']: {
    id: 'remote-gtk3-demo',
    icon: 'icon.svg',
    title: 'GTK3 Demo',
    type: 'remote',
    url: 'wss://app-endpoint.greenfield.app?launch=remote-gtk3-demo',
  },
  ['remote-kwrite']: {
    id: 'remote-kwrite',
    icon: 'icon.svg',
    title: 'KWrite',
    type: 'remote',
    url: 'wss://app-endpoint.greenfield.app?launch=remote-kwrite',
  },
  ['simple-web-gl']: {
    id: 'simple-web-gl',
    icon: 'icon.jpeg',
    title: 'Simple Web GL',
    type: 'web',
    url: `${window.location.origin}/apps/simple-web-gl/app.js`,
  },
  ['simple-web-shm']: {
    id: 'simple-web-shm',
    icon: 'icon.jpeg',
    title: 'Simple Web SHM',
    type: 'web',
    url: `${window.location.origin}/apps/simple-web-shm/app.js`,
  },
} as const

const greenfieldTheme = createMuiTheme({
  palette: {
    common: {
      black: '#000',
      white: 'rgba(240, 240, 240, 1)',
    },
    background: {
      paper: 'rgba(220, 220, 220, 1)',
      default: 'rgba(240, 240, 240, 1)',
    },
    primary: {
      light: 'rgba(167, 230, 97, 1)',
      main: 'rgba(111, 174, 42, 1)',
      dark: 'rgba(55, 121, 0, 1)',
      contrastText: '#fff',
    },
    secondary: {
      light: 'rgba(127, 247, 255, 1)',
      main: 'rgba(50, 191, 249, 1)',
      dark: 'rgba(0, 138, 192, 1)',
      contrastText: '#fff',
    },
    error: {
      light: 'rgba(255, 128, 169, 1)',
      main: 'rgba(250, 67, 117, 1)',
      dark: 'rgba(187, 0, 69, 1)',
      contrastText: '#fff',
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.87)',
      secondary: 'rgba(0, 0, 0, 0.54)',
      disabled: 'rgba(0, 0, 0, 0.38)',
      hint: 'rgba(0, 0, 0, 0.38)',
    },
  },
})

const useStyles = makeStyles((theme) => ({
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
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
  supabaseClient,
}: {
  compositorSession: CompositorSession
  supabaseClient: SupabaseClient
}) => {
  const classes = useStyles()

  const [activeApp, setActiveApp] = useState<typeof apps[keyof typeof apps] | null>(null)
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
  const [webAppLauncher] = useState(() =>
    createCompositorWebAppLauncher(createCompositorWebAppSocket(compositorSession)),
  )

  const launchApp = (appId: keyof typeof apps) => {
    const app = apps[appId]
    if (app.client) {
      return
    }

    if (app.type === 'remote') {
      remoteAppLauncher.launchURL(new URL(app.url)).then((client) => {
        app.client = client
        client.onClose().then(() => {
          if (activeAppRef.current?.client === client) {
            setActiveApp(null)
          }
          app.client = undefined
        })
      })
    } else {
      webAppLauncher.launch(new URL(app.url)).then((client) => {
        app.client = client
        client.onClose().then(() => {
          if (activeAppRef.current?.client === client) {
            setActiveApp(null)
          }
          app.client = undefined
        })
      })
    }
  }

  const activeClient = (clientId: string) => {
    const result = Object.entries(apps).find(([key, value]) => value.client?.id === clientId)
    if (result) {
      const [appId, app] = result
      setActiveApp(app)
    }
  }

  const closeActiveApp = () => activeApp?.client?.close()

  const logout = () => {
    Object.values(apps).forEach((app) => app.client?.close())
    supabaseClient.auth.signOut()
  }

  return (
    <React.StrictMode>
      <ThemeProvider theme={greenfieldTheme}>
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
            <AppBar position="static" color="default" variant="outlined">
              <Toolbar variant="dense">
                <IconButton
                  edge="start"
                  className={classes.menuButton}
                  color="inherit"
                  aria-label="menu"
                  onClick={() => setDrawerOpen(true)}
                >
                  <MenuIcon />
                </IconButton>
                <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)} keepMounted>
                  <Box mt={1} mb={1} ml={2} mr={2}>
                    <Logo fontSize="3em" />
                  </Box>
                  <Divider />
                  <List>
                    {Object.entries(apps).map(([appId, app]) => {
                      return (
                        <ListItem
                          button
                          onClick={() => {
                            launchApp(appId as keyof typeof apps)
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
                      variant="outlined"
                      size="small"
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
                        align="left"
                        variant="caption"
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
                              <MenuList dense autoFocusItem={activeAppMenuOpen} id="menu-list-grow">
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
                    <Typography color="textSecondary" variant="caption">
                      No Application active
                    </Typography>
                  </Box>
                )}
                <Box
                  mr={4}
                  display="flex"
                  flex={1}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <OutlinedInput
                    fullWidth
                    // readOnly
                    // disableUnderline
                    margin="dense"
                    spellCheck={false}
                    value={activeApp ? activeApp.url : ''}
                    placeholder="Application URL"
                    classes={{ input: classes.appURLInput }}
                    style={{
                      borderRadius: 16,
                    }}
                  />
                </Box>
                <Box>
                  <Button startIcon={<ExitToAppIcon />} onClick={logout}>
                    Logout
                  </Button>
                </Box>
              </Toolbar>
            </AppBar>
            <CompositorScene compositorSession={compositorSession} onActiveClient={activeClient} />
          </div>
        </CssBaseline>
      </ThemeProvider>
    </React.StrictMode>
  )
}
