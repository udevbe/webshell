import { Box, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import React, { FunctionComponent, useEffect, useRef } from 'react'
import { Page } from '../../../app/components/Page'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { Launcher } from '../../remote-apps/components/Launcher'
import { selectAppByClientId } from '../../remote-apps/remoteAppsSlice'
import { ActiveClientMenu } from '../components/ActiveClientMenu'
import { FileUpload } from '../components/FileUpload'
import { UserMenu } from '../components/UserMenu'
import { forceSceneRedraw, scene, selectActiveClient } from '../compositorSlice'

const useStyles = makeStyles(() => ({
  sceneParent: {
    height: '100%',
    width: '100%',
    backgroundImage: 'url("./background_pattern.png")',
    backgroundRepeat: 'repeat',
  },
}))

export const CompositorPage: FunctionComponent = () => {
  const dispatch = useAppDispatch()
  const sceneParent = useRef<HTMLDivElement>(null)
  useEffect(() => {
    scene.style.position = 'absolute'
    scene.style.outline = '0'

    const parent = sceneParent.current
    let resizeObserver: ResizeObserver | undefined
    if (parent) {
      const sizeScene = () => {
        scene.width = parent.clientWidth * devicePixelRatio
        scene.height = parent.clientHeight * devicePixelRatio

        // propagate the integer size back to CSS pixels to ensure they align up 1:1.
        scene.style.width = scene.width / devicePixelRatio + 'px'
        scene.style.height = scene.height / devicePixelRatio + 'px'

        dispatch(forceSceneRedraw())
      }
      resizeObserver = new ResizeObserver(sizeScene)
      parent.appendChild(scene)
      sizeScene()
      resizeObserver.observe(parent)
    }
    return () => {
      resizeObserver?.disconnect()
      parent?.removeChild(scene)
    }
  }, [])

  const activeClient = useAppSelector(selectActiveClient)
  const activeApp = useAppSelector(selectAppByClientId(activeClient?.id))

  const classes = useStyles()
  return (
    <Page
      header={
        <>
          <FileUpload />
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
            {activeApp ? (
              <ActiveClientMenu activeApp={activeApp} />
            ) : (
              <Typography color='textSecondary' variant='caption'>
                No Application active
              </Typography>
            )}
          </Box>
          <Box
            mr={4}
            display='flex'
            flex={1}
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          />
          <Box
            mt={0.25}
            pr={1}
            pl={1}
            height={48}
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <UserMenu />
            <Launcher anchorElRef={sceneParent} />
          </Box>
        </>
      }
    >
      <div ref={sceneParent} className={classes.sceneParent} />
    </Page>
  )
}
