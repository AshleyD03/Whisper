import React from 'react'
import type { Item } from 'ytpl'
import type { ModalHook } from '../components/Window/types'
import { PlaylistHook, Video } from '../typings/Playlist'
import { uuidv4 } from './uuid'
import Ask_Modal from '../components/AskModal'

export function makeFreshPlaylist([_, setPlaylist]: PlaylistHook) {
  setPlaylist({
    title: '',
    author: '',
    videos: [],
    cover: {}
  })
}

export function addVideosToPlaylist([playlist, setPlaylist]: PlaylistHook, payload: Video | Array<Video>, index?: number) {
  if (!Array.isArray(payload)) payload = [payload]
  if (!index || index < 0 || index > playlist.videos.length) {
    index = playlist.videos.length
  }
  setPlaylist({
    ...playlist,
    videos: [
      ...playlist.videos.slice(0, index),
      ...payload,
      ...playlist.videos.slice(index + 1)
    ]
  })
}

export function addVideosToClearPlaylist([playlist, setPlaylist]: PlaylistHook, payload: Video | Array<Video>) {
  if (!Array.isArray(payload)) payload = [payload]
  setPlaylist({
    ...playlist,
    videos: [...payload]
  })
}

export function removeVideoFromPlaylist([playlist, setPlaylist]: PlaylistHook, index: number) {
  setPlaylist({
    ...playlist,
    videos: [
      ...playlist.videos.slice(0, index),
      ...playlist.videos.slice(index + 1)
    ]
  })
}

export function clearVideosFromPlaylist([playlist, setPlaylist]: PlaylistHook) {
  setPlaylist({
    ...playlist,
    videos: []
  })
}

export function replaceVideoInPlaylist([playlist, setPlaylist]: PlaylistHook, video: Video, uid: string) {
  const index = playlist.videos.findIndex(vid => vid.uid === uid)

  setPlaylist({
    ...playlist,
    videos: [
      ...playlist.videos.slice(0, index),
      video,
      ...playlist.videos.slice(index + 1)
    ]
  })
}

export function processAddPlaylist(payload: Item[], playlistHook: PlaylistHook, modalHook: ModalHook) {
  const videos: Array<Video> = payload
    .map((item): Video => {
      return {
        title: item.title,
        author: item.author.name,
        url: item.url,
        uid: uuidv4()
      }
    })
  if (playlistHook[0].videos.length > 0) {
    modalHook[0](
      <Ask_Modal
        msg='How would you like to add this playlist to your current?'
        options={[
          { name: 'Add to end', onClick: () => addVideosToPlaylist(playlistHook, videos) },
          { name: 'Overwrite current', onClick: () => addVideosToClearPlaylist(playlistHook, videos) }
        ]}
      />
    )
  }
  else addVideosToPlaylist(playlistHook, videos)
}