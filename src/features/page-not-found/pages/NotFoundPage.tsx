import { Container, IconButton, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import React, { FunctionComponent } from 'react'
import { useHistory } from 'react-router-dom'
import { Page } from '../../../app/components/Page'

const useStyles = makeStyles(() => ({
  container: {
    height: '100%',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
}))

export const NotFound: FunctionComponent = () => {
  const history = useHistory()
  const goBack = () => history.goBack()

  const classes = useStyles()
  return (
    <Page
      header={
        <>
          <IconButton onClick={goBack}>
            <ArrowBackIcon />
          </IconButton>
          <Typography>Page Not Found</Typography>
        </>
      }
    >
      <Container className={classes.container}>
        <Typography>Page not found.</Typography>
      </Container>
    </Page>
  )
}
