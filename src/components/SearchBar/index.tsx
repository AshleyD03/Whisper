import React, { FormEvent, useContext, useRef } from 'react'
import './index.scss'

import { PlaylistContext } from '../../App'
import type { PlaylistHook } from '../../typings/Playlist'
import { ModalContext } from '../Window'
import type { Result } from 'ytsr' 
import { processAddPlaylist, addVideosToPlaylist } from '../../modules/Playlist'

import SearchIcon from '@material-ui/icons/Search';
import LoopIcon from '@material-ui/icons/Loop';
import { uuidv4 } from '../../modules/uuid'

export default function ({ onSearch=(res) => {}, defaultValue="" } : { onSearch: (res: Result) => void, defaultValue?: string}) {

  const playlistHook: PlaylistHook = useContext(PlaylistContext)
  const modalHook = useContext(ModalContext)
  const inputRef = useRef<HTMLInputElement>(null)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()

    const input = inputRef.current;
    input.blur();
    input.disabled = true;

    const result = await ipcRenderer.invoke('youtube-search', input.value)
    if (result.type === 'video') {

      const det = result.payload
      addVideosToPlaylist(playlistHook, {
        title: det.title,
        author: det.author.name,
        url: det.video_url,
        uid: uuidv4()
      })

    }

    else if (result.type === 'playlist') {
      processAddPlaylist(result.payload, playlistHook, modalHook)
    }

    else {
      onSearch(result.payload)
    }

    input.disabled = false;
    input.value = '';
  }

  return (
    <form
      onSubmit={onSubmit}
      className="search-bar">
      <input
        ref={inputRef}
        type="text"
        defaultValue={defaultValue}
        required
      />
      <label
        onClick={() => inputRef.current.focus()}
      >
        <SearchIcon />
        <LoopIcon />
      </label>
    </form>
  )
}