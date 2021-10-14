import React, { useState, useContext, useEffect } from 'react'
import './index.scss'

import { PlaylistContext } from '../../App'
import type { PlaylistHook } from '../../typings/Playlist'

export default function PlaylistHeader(
	{ onSelect = () => { }, selected = false, disabled = false }:
		{ onSelect?: () => void, selected?: boolean, disabled?: boolean }) {

	// Listen to selected and disabled 
	const [isSelected, setIsSelected] = useState<boolean>(selected);
	useEffect(() => setIsSelected(selected), [selected])
	const [isDisabled, setIsDisabled] = useState<boolean>(disabled)
	useEffect(() => setIsDisabled(disabled), [disabled])

	const [playlist]: PlaylistHook = useContext(PlaylistContext)

	return (
		<span
			className={`pl-header ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`}
			onClick={() => {
				if (isDisabled) return
				setIsSelected(true)
				onSelect()
			}}
		>
			<img
				src={playlist.cover.dataURL || './static/images/empty.png'}
				alt="playlist cover" />
			<span className="text">
				<span> {playlist.title || 'no title'} </span>
				<span> {`${playlist.author || 'no artist'} • ${playlist.videos.length} videos`} </span>
			</span>
		</span>
	)
}