import { Box, Divider, Drawer, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core'
import IconButton from '@material-ui/core/IconButton'
import { makeStyles } from '@material-ui/core/styles'
import MenuIcon from '@material-ui/icons/Menu'
import SettingsIcon from '@material-ui/icons/Settings'
import React, { FunctionComponent } from 'react'
import { useHistory } from 'react-router-dom'
import Logo from '../../../app/components/Logo'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { RemoteApp } from '../../../app/types/webshell'
import { makeAppActive } from '../../compositor/compositorSlice'
import { hideDrawer, selectDrawerVisible, showDrawer } from '../drawerSlice'

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

export const ShellDrawer: FunctionComponent<{ availableApps: RemoteApp[] }> = ({ availableApps }) => {
  const dispatch = useAppDispatch()

  const launchApp = (app: RemoteApp) => dispatch(makeAppActive({ app }))

  const history = useHistory()
  const goToSettings = () => history.push('/settings')

  const drawerOpen = useAppSelector(selectDrawerVisible)
  const setDrawerOpen = () => dispatch(showDrawer())
  const setDrawerClosed = () => dispatch(hideDrawer())

  const classes = useStyles()
  return (
    <>
      <IconButton edge='start' className={classes.menuButton} color='inherit' aria-label='menu' onClick={setDrawerOpen}>
        <MenuIcon />
      </IconButton>
      <Drawer anchor='left' open={drawerOpen} onClose={setDrawerClosed} keepMounted>
        <Box mt={1} mb={1} ml={2} mr={2}>
          <Logo fontSize='3em' />
        </Box>
        <Divider />
        <List>
          {availableApps.map((app) => {
            return (
              <ListItem
                button
                onClick={() => {
                  launchApp(app)
                  setDrawerClosed()
                }}
                key={app.id}
              >
                <ListItemIcon>
                  <img src={`/apps/${app.id}/${app.icon}`} style={{ width: 24, height: 24 }} />
                </ListItemIcon>
                <ListItemText primary={app.title} />
              </ListItem>
            )
          })}
        </List>
        <Divider />
        <List>
          <ListItem
            button
            onClick={() => {
              setDrawerClosed()
              goToSettings()
            }}
          >
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary='Settings' />
          </ListItem>
        </List>
      </Drawer>
    </>
  )
}
