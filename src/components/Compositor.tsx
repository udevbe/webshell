import React, { MutableRefObject, useEffect } from 'react'

export const Scene = (props: {
  parentRef: MutableRefObject<HTMLElement | null>
  getCanvas: () => HTMLCanvasElement
}) => {
  useEffect(() => {
    const canvas = props.getCanvas()
    const parent = props.parentRef.current

    parent?.appendChild(canvas)
    return () => {
      parent?.removeChild(canvas)
    }
  }, [])
  return null
}
