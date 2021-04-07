import { Button, Dialog, DialogActions, DialogContent, LinearProgress, Snackbar, Typography } from '@material-ui/core'
import CloudUploadIcon from '@material-ui/icons/CloudUpload'
import MuiAlert from '@material-ui/lab/Alert'
import React, { ChangeEvent, useState } from 'react'

// TODO move file upload to separate feature

type Upload = { fileName: string; progress: number; xhr: XMLHttpRequest }

export const FileUpload = () => {
  const [showDownloadSuccess, setShowDownloadSuccess] = useState(false)
  const handleShowDownloadSuccessClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return
    }
    setShowDownloadSuccess(false)
  }
  const [fileUploads, setFileUploads] = useState<Upload[]>([])

  const handleUploadCancel = () => {
    fileUploads.forEach((fileUpload) => fileUpload.xhr.abort())
    setFileUploads([])
  }

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files === null) {
      return
    }
    const newFileUploads: Upload[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]

      const fileUpload: Upload = {
        fileName: file.name,
        progress: 0,
        xhr: new XMLHttpRequest(),
      }

      const reader = new FileReader()
      fileUpload.xhr.upload.addEventListener(
        'progress',
        function (e) {
          if (e.lengthComputable) {
            fileUpload.progress = Math.round((e.loaded * 100) / e.total)
          }
        },
        false,
      )

      fileUpload.xhr.onreadystatechange = () => {
        // TODO check for upload failures
        if (fileUpload.xhr.readyState === 4) {
          // Upload done
          const busyUploads = fileUploads.filter((busyFileUpload) => busyFileUpload.fileName !== fileUpload.fileName)
          setFileUploads(busyUploads)
          if (busyUploads.length === 0) {
            setShowDownloadSuccess(true)
          }
        }
      }

      fileUpload.xhr.open('POST', `http://localhost/upload`)
      fileUpload.xhr.overrideMimeType('application/octet-stream')
      fileUpload.xhr.setRequestHeader('X-ORIG-FILE-NAME', file.name)
      reader.onload = (evt) => {
        if (evt.target) {
          fileUpload.xhr.send(evt.target.result)
        }
      }
      reader.readAsArrayBuffer(file)

      newFileUploads[i] = fileUpload
    }

    setFileUploads(newFileUploads)
  }

  return (
    <>
      <input type='file' hidden multiple onChange={handleFileUpload} id='upload-input' />
      <label htmlFor='upload-input'>
        <Button size='small' startIcon={<CloudUploadIcon />} component='span'>
          Upload File
        </Button>
      </label>
      <Dialog open={fileUploads.length > 0}>
        <DialogContent>
          {fileUploads.map((fileUpload) => {
            return (
              <div key={fileUpload.fileName}>
                <Typography>{fileUpload.fileName}</Typography>
                <LinearProgress style={{ width: 200 }} variant='determinate' value={fileUpload.progress} />
              </div>
            )
          })}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUploadCancel} color='primary' autoFocus>
            cancel
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={showDownloadSuccess} autoHideDuration={6000} onClose={handleShowDownloadSuccessClose}>
        <MuiAlert elevation={6} variant='filled' onClose={handleShowDownloadSuccessClose} severity='success'>
          Upload success.
        </MuiAlert>
      </Snackbar>
    </>
  )
}
