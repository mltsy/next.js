import React from 'react'
import { draftMode } from 'next/headers'

export default function Page() {
  const { enabled } = draftMode()

  return (
    <>
      <h1>Draft Mode Test</h1>
      <p>
        Random: <em id="rand">{Math.random()}</em>
      </p>
      <p>
        State: <strong id="mode">{enabled ? 'ENABLED' : 'DISABLED'}</strong>
      </p>
    </>
  )
}
