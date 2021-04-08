import {
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Slider,
  TextField,
  Typography,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { Keyboard, Mouse } from '@material-ui/icons'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import { Autocomplete } from '@material-ui/lab'
import { nrmlvo } from 'greenfield-compositor'
import React, { FunctionComponent, useRef, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Page } from '../../../app/components/Page'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import {
  configureKeymap,
  configureScrollFactor,
  selectActiveKeymap,
  selectKeymaps,
  selectScrollFactor,
  selectSettingsLoading,
} from '../settingsSlice'

const useStyles = makeStyles((theme) => ({
  spacer: {
    marginTop: theme.spacing(6),
  },
}))

export const SettingsPage: FunctionComponent = () => {
  const history = useHistory()
  const goBack = () => history.goBack()

  const availableKeymaps = useAppSelector(selectKeymaps)
  const nrmlvo = useAppSelector(selectActiveKeymap)
  const scrollFactor = useAppSelector(selectScrollFactor)
  const loading = useAppSelector(selectSettingsLoading)

  const keyboardLayoutNames = useRef<string[]>([])
  keyboardLayoutNames.current = availableKeymaps.map((nrmlvo) => nrmlvo.name)

  const dispatch = useAppDispatch()
  const setLayout = (keymap: nrmlvo) => dispatch(configureKeymap({ keymap }))

  const [scrollSpeed, setScrollSpeed] = useState(scrollFactor * 100)
  const handleScrollSpeedUpdate = (value: number) => setScrollSpeed(value)
  const handleScrollSpeedCommit = () => {
    const scrollFactor = scrollSpeed / 100
    dispatch(configureScrollFactor({ scrollFactor }))
  }

  const classes = useStyles()
  return (
    <Page
      header={
        <>
          <IconButton onClick={goBack}>
            <ArrowBackIcon />
          </IconButton>
          <Typography>Settings</Typography>
        </>
      }
    >
      {loading ? null : (
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
              options={availableKeymaps}
              getOptionLabel={(nrmlvo) => nrmlvo.name}
              value={nrmlvo}
              inputValue={nrmlvo?.name}
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
              valueLabelFormat={(value: number) => `${value}%`}
              onChange={(_, value) => handleScrollSpeedUpdate(value as number)}
              onChangeCommitted={() => handleScrollSpeedCommit()}
            />
          </ListItem>
          <div className={classes.spacer} />
        </List>
      )}
    </Page>
  )
}
