import { IconButton, Typography } from '@material-ui/core'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import React from 'react'
import { useHistory } from 'react-router-dom'
import { Page } from '../../../app/components/Page'
import { FileManager, FileNavigator } from '@opuscapita/react-filemanager'
import connectorNodeV1 from '@opuscapita/react-filemanager-connector-node-v1'

const apiOptions = {
  ...connectorNodeV1.apiOptions,
  apiRoot: `http://localhost:3020`, // Or you local Server Node V1 installation.
}

export const FileManagerPage = () => {
  const history = useHistory()
  const goBack = () => history.goBack()

  return (
    <Page
      header={
        <>
          <IconButton onClick={goBack}>
            <ArrowBackIcon />
          </IconButton>
          <Typography>Files</Typography>
        </>
      }
    >
      <FileManager>
        <FileNavigator
          id='filemanager-1'
          api={connectorNodeV1.api}
          apiOptions={apiOptions}
          capabilities={connectorNodeV1.capabilities}
          listViewLayout={connectorNodeV1.listViewLayout}
          viewLayoutOptions={connectorNodeV1.viewLayoutOptions}
        />
      </FileManager>
    </Page>
  )
}
