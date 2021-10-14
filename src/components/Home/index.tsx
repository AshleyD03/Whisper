import React from 'react'
const { useContext } = React

import { WindowContext } from '../Window'

export function Home() {

  const [pageKEY, setPageKEY] = useContext(WindowContext)

  return (
    <>
      <h1>
        Home
      </h1>
      <div
        onClick={() => setPageKEY('Editor')}
      >
        Got to editor
      </div>
    </>
  )
}