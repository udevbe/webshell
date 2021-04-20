import { Box, Divider, Drawer, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core'
import IconButton from '@material-ui/core/IconButton'
import { makeStyles } from '@material-ui/core/styles'
import { Folder } from '@material-ui/icons'
import HomeIcon from '@material-ui/icons/Home'
import MenuIcon from '@material-ui/icons/Menu'
import SettingsIcon from '@material-ui/icons/Settings'
import React, { FunctionComponent, useState } from 'react'
import { useHistory } from 'react-router-dom'
import Logo from './Logo'

const drawerEntries = [
  { name: 'Home', icon: <HomeIcon />, pagePath: '/' } as const,
  { name: 'Files', icon: <Folder />, pagePath: './files' } as const,
  { name: 'Settings', icon: <SettingsIcon />, pagePath: '/settings' } as const,
] as const

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

export const PageDrawer: FunctionComponent = () => {
  const history = useHistory()
  const goTo = (navigation: string) => history.push(navigation)

  const [drawerVisible, setDrawerVisible] = useState(false)
  const setDrawerOpen = () => setDrawerVisible(true)
  const setDrawerClosed = () => setDrawerVisible(false)

  const classes = useStyles()
  return (
    <>
      <IconButton edge='start' className={classes.menuButton} color='inherit' aria-label='menu' onClick={setDrawerOpen}>
        <MenuIcon />
      </IconButton>
      <Drawer anchor='left' open={drawerVisible} onClose={setDrawerClosed} keepMounted>
        <Box mt={1} mb={1} ml={2} mr={2}>
          <Logo fontSize='3em' />
        </Box>
        <Divider />
        <List>
          {drawerEntries.map(({ name, icon, pagePath }) => {
            return (
              <ListItem button key={name} onClick={() => goTo(pagePath)}>
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText primary={name} />
              </ListItem>
            )
          })}
        </List>
      </Drawer>
    </>
  )
}
