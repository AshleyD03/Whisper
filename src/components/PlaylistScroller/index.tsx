import React, { useContext, useState, useEffect, MouseEvent } from 'react'
import './index.scss'

import { PlaylistContext } from '../../App'
import type { Video } from '../../typings/Playlist'
import { removeVideoFromPlaylist } from '../../modules/Playlist'

import DeleteIcon from '@material-ui/icons/Delete';

export default function PlaylistScroller (
  { onSelect = (_) => { },
    deselect = (_) => { },
    selected = false,
    disabled = false
  }:
    {
      onSelect?: (x: Video) => void,
      deselect?: (x: Video) => void,
      selected?: boolean,
      disabled?: boolean
    }) {

  const [playlist, setPlaylist] = useContext(PlaylistContext)
  const [currentVideo, setCurrent] = useState<Video>(playlist.videos[0])

  // Listen to selected and disabled 
  const [isSelected, setIsSelected] = useState<boolean>(selected);
  useEffect(() => setIsSelected(selected), [selected])
	const [isDisabled, setIsDisabled] = useState<boolean>(disabled)
	useEffect(() => setIsDisabled(disabled), [disabled])

  function selectMe(video: Video) {
    if (isDisabled) return
    setCurrent(video)
    onSelect(video)
    if (!isSelected) setIsSelected(true)
  }

  function deleteMe(e: MouseEvent, video: Video) {
    e.stopPropagation()
    if (isDisabled) return
    removeVideoFromPlaylist([playlist, setPlaylist], playlist.videos.indexOf(video))
    setCurrent(undefined)
    deselect(video)
  }

  return (
    <ul className={`pl-list ${isDisabled ? 'disabled' : ''}`}>
      {playlist.videos.map(video => (
        <li
          key={playlist.videos.indexOf(video)}
          className={`option ${(currentVideo === video && isSelected) ? 'selected' : ''}`}
          onClick={() => selectMe(video)}
        >
          <span className='title'>
            {video.title}
          </span>
          <span
            className='bin'
            onClick={e => { deleteMe(e, video) }}
          >
            <DeleteIcon />
          </span>
          <span className='line'></span>
        </li>
      )
      )}
    </ul>
  )
}
