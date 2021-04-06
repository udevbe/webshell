import {
  Button,
  ClickAwayListener,
  Grow,
  ListItemText,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Typography,
} from '@material-ui/core'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'
import React, { useEffect, useRef, useState } from 'react'
import { useAppDispatch } from '../../../app/hooks'
import { RemoteApp } from '../../remote-apps/types'
import { closeApp } from '../compositorSlice'

export const ActiveClientMenu = ({ activeApp }: { activeApp: RemoteApp }) => {
  const activeAppButtonAnchorRef = useRef<HTMLButtonElement>(null)
  const [activeAppMenuOpen, setActiveAppMenuOpen] = useState(false)
  const prevActiveAppMenuOpen = useRef(activeAppMenuOpen)

  // return focus to the button when we transitioned from !open -> open
  useEffect(() => {
    if (prevActiveAppMenuOpen.current && !activeAppMenuOpen) {
      activeAppButtonAnchorRef.current?.focus()
    }
    prevActiveAppMenuOpen.current = activeAppMenuOpen
  }, [activeAppMenuOpen])

  const handleActiveAppMenuClose = (event: React.MouseEvent<EventTarget>) => {
    if (activeAppButtonAnchorRef.current && activeAppButtonAnchorRef.current.contains(event.target as HTMLElement)) {
      return
    }

    setActiveAppMenuOpen(false)
  }

  const dispatch = useAppDispatch()
  const onCloseApp: any = () => dispatch(closeApp({ app: activeApp }))
  const handleActiveAppMenuToggle = () => setActiveAppMenuOpen((prevOpen) => !prevOpen)

  return (
    <>
      <Button
        ref={activeAppButtonAnchorRef}
        onClick={handleActiveAppMenuToggle}
        fullWidth
        size='small'
        startIcon={<img src={activeApp.icon} style={{ width: 24, height: 24, marginRight: 8 }} />}
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
                  <MenuItem
                    dense
                    onClick={(event) => {
                      onCloseApp()
                      handleActiveAppMenuClose(event)
                    }}
                  >
                    <ListItemText>Close</ListItemText>
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
