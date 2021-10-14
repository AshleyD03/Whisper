import React, { useRef } from 'react'

import { PlaylistContext } from '../../App'
import type { Playlist } from '../../typings/Playlist'

// === Main Components ===
export function PlaylistInfoForm() {
  const [playlist, setPlaylist] = React.useContext(PlaylistContext)

  // Input refs 
  const imgRef = useRef<HTMLInputElement>()
  const titleRef = useRef<HTMLInputElement>()
  const authorRef = useRef<HTMLInputElement>()

  // On Submit
  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    let updates: Partial<Playlist> = {
      title: titleRef.current.value,
      author: authorRef.current.value
    }

    const files = imgRef.current.files
    if (files[0]) {
      if (playlist.cover.dataURL) try {
        URL.revokeObjectURL(playlist.cover.dataURL)
      } catch {}

      updates.cover = {
        file: files[0],
        dataURL: URL.createObjectURL(files[0]),
        alt: files[0].name
      }
    }
    setPlaylist({
      ...playlist,
      ...updates
    })
  }

  // Trigger event submit
  const buttonRef = useRef<HTMLButtonElement>(null)
  function submitForm() {
    if (buttonRef.current) buttonRef.current.click()
  }

  return (
    <form
      className="playlist-info-form"
      onSubmit={onSubmit}
    >
      <label>
        <img
          src={playlist.cover.dataURL || "./static/images/empty.png"}
          alt={playlist.cover.alt || "no playlist image uploaded"}
        />
        <input
          ref={imgRef}
          type="file"
          accept="image/*"

          onChange={submitForm}
        />
      </label>

      <input
        ref={titleRef}
        className="title"
        type="text"
        defaultValue={playlist.title}
        placeholder="Playlist title"
        onBlur={submitForm}
      />

      <input
        ref={authorRef}
        className="author"
        type="text"
        defaultValue={playlist.author || ""}
        placeholder="Author"
        onBlur={submitForm}
      />

      <button
        ref={buttonRef}
        style={{ display: 'none' }}
      />
    </form>
  )
}