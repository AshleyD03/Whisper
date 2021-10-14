import React, { useRef, useEffect, useState } from 'react'

import YouTube from 'react-youtube'
import { youtubeURLgetId } from '../../modules/Youtube';
import { replaceVideoInPlaylist } from '../../modules/Playlist';
import { PlaylistContext } from '../../App'
import { TextInput } from '../Inputs';

// Types
import type { Video } from '../../typings/Playlist'

export function VideoInfoForm({ uid }: { uid: string }) {
  const [playlist, setPlaylist] = React.useContext(PlaylistContext)

  // Get video
  const video = playlist.videos.find(vid => vid.uid === uid)

  // Input refs
  const titleRef = useRef<HTMLInputElement>()
  const authorRef = useRef<HTMLInputElement>()
  const urlRef = useRef<HTMLInputElement>()

  // Check if new URL is different, then apply ID
  const url = useRef<string>('')
  const [id, setID] = useState<string | false>(undefined)
  if (url.current !== video.url) {
    url.current = video.url
    if (typeof url.current === 'string') setID(youtubeURLgetId(url.current))
  }

  // Update form values
  useEffect(() => {
    titleRef.current.value = video.title
    authorRef.current.value = video.author
    urlRef.current.value = video.url
  })

  // On Submit
  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    let updates: Partial<Video> = {
      title: titleRef.current.value,
      author: authorRef.current.value
    }

    const newUrl = urlRef.current.value
    if (newUrl !== url.current) {
      try {
        if (youtubeURLgetId(newUrl) !== id) {
          updates.url = newUrl
        }
      } catch {}
    }
    replaceVideoInPlaylist([playlist, setPlaylist], {
      ...video,
      ...updates
    }, video.uid)
  }

  // Trigger event submit
  const buttonRef = useRef<HTMLButtonElement>(null)
  function submitForm() {
    if (buttonRef.current) buttonRef.current.click()
  }

  return (
    <form
      className="video-info-form"
      onSubmit={onSubmit}
    >
      <YouTube
        containerClassName="youtube"
        videoId={id || 'OJWJE0x7T4Q'}
      />

      <TextInput
        title='title'
        refHook={titleRef}
        defaultValue={video.title}
        onUpdate={submitForm}
      />

      <TextInput
        title='Author'
        refHook={authorRef}
        defaultValue={video.author}
        onUpdate={submitForm}
      />

      <TextInput
        title='Link'
        refHook={urlRef}
        defaultValue={video.url}
        onUpdate={submitForm}
      />

      <button
        ref={buttonRef}
        style={{ display: 'none' }}
      />
    </form>
  )
}