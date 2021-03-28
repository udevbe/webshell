import { Divider, List, ListItem, ListItemIcon, ListItemText, Slider, TextField, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { Keyboard, Mouse } from '@material-ui/icons'
import { Autocomplete } from '@material-ui/lab'
import React, { useRef, useState } from 'react'
import { CompositorSession, nrmlvo } from 'greenfield-compositor'

const useStyles = makeStyles((theme) => ({
  spacer: {
    marginTop: theme.spacing(6),
  },
  container: {
    backgroundColor: theme.palette.background.default,
    width: '100%',
    height: '100%',
  },
}))

export const Settings = ({ compositorSession }: { compositorSession: CompositorSession }) => {
  const classes = useStyles()

  const nrmlvoEntries: nrmlvo[] = compositorSession.globals.seat.keyboard.nrmlvoEntries
  const currentNrmlvo = compositorSession.globals.seat.keyboard.nrmlvo
  const currentScrollFactor = compositorSession.globals.seat.pointer.scrollFactor

  const keyboardLayoutNames = useRef<string[]>([])
  keyboardLayoutNames.current = nrmlvoEntries.map((nrmlvo) => nrmlvo.name)
  const [nrmlvo, setNrmlvo] = useState(currentNrmlvo)

  const setLayout = (nrmlvo: nrmlvo) => {
    compositorSession.userShell.actions.setUserConfiguration({ keyboardLayoutName: nrmlvo.name })
    setNrmlvo(nrmlvo)
    window.localStorage.setItem('keymap', JSON.stringify(nrmlvo))
  }

  const [scrollFactor, setScrollFactor] = useState(currentScrollFactor)
  const [scrollSpeed, setScrollSpeed] = useState(scrollFactor * 100)
  const handleScrollSpeedUpdate = (value: number) => {
    setScrollSpeed(value)
  }
  const handleScrollSpeedCommit = () => {
    const newScrollFactor = scrollSpeed / 100
    compositorSession.userShell.actions.setUserConfiguration({ scrollFactor: newScrollFactor })
    setScrollFactor(scrollFactor)
    window.localStorage.setItem('scrollFactor', JSON.stringify(scrollFactor))
  }
  const handleScrollSpeedLabelUpdate = (value: number) => `${value}%`

  return (
    <div className={classes.container}>
      <List>
        <ListItem>
          <ListItemIcon>
            <Keyboard />
          </ListItemIcon>
          <ListItemText primary='Keyboard' />
        </ListItem>
        <Divider variant='fullWidth' />
        <ListItem>
          <Autocomplete
            id='keyboard-layout'
            disableClearable
            options={nrmlvoEntries}
            getOptionLabel={(nrmlvo) => nrmlvo.name}
            value={nrmlvo}
            inputValue={nrmlvo.name}
            style={{ width: '100%' }}
            onChange={(_, value) => setLayout(value)}
            renderInput={(params) => <TextField {...params} label='Layout' variant='standard' fullWidth />}
          />
        </ListItem>

        <div className={classes.spacer} />
        <ListItem>
          <ListItemIcon>
            <Mouse />
          </ListItemIcon>
          <ListItemText primary='Mouse' />
        </ListItem>
        <Divider variant='fullWidth' />
        <ListItem
          style={{
            paddingBottom: 0,
          }}
        >
          <Typography id='scroll-speed-slider' gutterBottom={false} variant='caption' color='textSecondary'>
            Scroll Speed
          </Typography>
        </ListItem>
        <ListItem
          style={{
            paddingTop: 0,
          }}
        >
          <Slider
            min={1}
            max={300}
            step={1}
            aria-labelledby='scroll-speed-slider'
            valueLabelDisplay='on'
            value={scrollSpeed}
            valueLabelFormat={(value) => handleScrollSpeedLabelUpdate(value)}
            onChange={(_, value) => {
              handleScrollSpeedUpdate(value as number)
            }}
            onChangeCommitted={() => handleScrollSpeedCommit()}
          />
        </ListItem>

        <div className={classes.spacer} />
      </List>
    </div>
  )
}
