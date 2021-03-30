import {
  Button,
  ClickAwayListener,
  Grow,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Typography,
} from '@material-ui/core'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import { useKeycloak } from '@react-keycloak/web'
import React, { MouseEventHandler, useEffect, useRef, useState } from 'react'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import VpnKeyIcon from '@material-ui/icons/VpnKey'
import { useHistory } from 'react-router-dom'

export const UserMenu = () => {
  const { keycloak } = useKeycloak()
  const history = useHistory()
  const userButtonAnchorRef = useRef<HTMLButtonElement>(null)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const prevUserMenuOpen = useRef(userMenuOpen)

  // return focus to the button when we transitioned from !open -> open
  useEffect(() => {
    if (prevUserMenuOpen.current && !userMenuOpen) {
      userButtonAnchorRef.current?.focus()
    }

    prevUserMenuOpen.current = userMenuOpen
  }, [userMenuOpen])

  const handleUserMenuClose = (event: React.MouseEvent<EventTarget>) => {
    if (userButtonAnchorRef.current && userButtonAnchorRef.current.contains(event.target as HTMLElement)) {
      return
    }

    setUserMenuOpen(false)
  }
  const logout: MouseEventHandler<HTMLLIElement | HTMLAnchorElement> = (event) => {
    event.preventDefault()
    // TODO check return
    keycloak.logout()
  }

  const changePassword: MouseEventHandler<HTMLLIElement | HTMLAnchorElement> = () => {
    history.push('/changepassword')
  }

  const handleUserMenuToggle = () => setUserMenuOpen((prevOpen) => !prevOpen)

  return (
    <>
      <Button
        ref={userButtonAnchorRef}
        onClick={handleUserMenuToggle}
        fullWidth
        size='small'
        startIcon={<AccountCircleIcon />}
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
          {keycloak.clientId ?? 'Unknown User'}
        </Typography>{' '}
      </Button>
      <Popper open={userMenuOpen} anchorEl={userButtonAnchorRef.current} role={undefined} transition disablePortal>
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
          >
            <Paper
              style={
                {
                  // width: 170,
                }
              }
              elevation={3}
            >
              <ClickAwayListener onClickAway={handleUserMenuClose}>
                <MenuList dense autoFocusItem={userMenuOpen} id='menu-list-grow'>
                  <MenuItem
                    dense
                    onClick={(event) => {
                      changePassword(event)
                      handleUserMenuClose(event)
                    }}
                  >
                    <ListItemIcon>
                      <VpnKeyIcon />
                    </ListItemIcon>
                    <ListItemText>Change Password</ListItemText>
                  </MenuItem>
                  <MenuItem
                    dense
                    onClick={(event) => {
                      logout(event)
                      handleUserMenuClose(event)
                    }}
                  >
                    <ListItemIcon>
                      <ExitToAppIcon />
                    </ListItemIcon>
                    <ListItemText>Logout</ListItemText>
                  </MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  )
}
