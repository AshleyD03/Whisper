import React, { useContext } from 'react'

import type { Video, Playlist } from 'ytsr'
import ListIcon from '@material-ui/icons/List';
import { PlaylistContext } from '../../App'
import { viewsToString } from '../../modules/Youtube';
import { processAddPlaylist, addVideosToPlaylist } from '../../modules/Playlist';
import { uuidv4 } from '../../modules/uuid';
import { ModalContext } from '../Window';

export function Video_Item({ item }: { item: Video }) {
  const playlistHook = useContext(PlaylistContext)

  function onClick() {
    addVideosToPlaylist(playlistHook, {
      title: item.title,
      author: item.author.name,
      url: item.url,
      uid: uuidv4()
    })
  }

  return (
    <li
      onClick={onClick}
    >
      <span className="icon" style={{ backgroundImage: `url(${item.bestThumbnail.url})` }}>
        <span className="time-stamp">
          {item.duration}
        </span>
      </span>
      <span className="text">
        <span className="title"> {item.title} </span>
        <span className="stats">
          {`${viewsToString(item.views)} • ${item.uploadedAt}`}
        </span>
        <span className="author">
          <span style={{ background: `url(${item.author.bestAvatar.url})` }} />
          {item.author.name}
        </span>
      </span>
    </li>
  )
}

export function Playlist_Item({ item }: { item: Playlist }) {
  const playlistHook = useContext(PlaylistContext)
  const modalHook = useContext(ModalContext)

  async function onClick() {
    const result = await ipcRenderer.invoke('youtube-search', item.url)
    if (result.type === 'playlist') {
      processAddPlaylist(result.payload, playlistHook, modalHook)
    }
  }

  return (
    <li
      onClick={onClick}
    >
      <span className="icon" style={{ backgroundImage: `url(${item.firstVideo.bestThumbnail.url})` }}>
        <span className="list-length">
          {item.length.toString()}
          <ListIcon />
        </span>
      </span>
      <span className="text">
        <span className="title">
          {item.title}
        </span>
        <span className="author">
          Daft Punk
        </span>
      </span>
    </li>
  )
}