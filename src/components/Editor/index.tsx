import React, { useState } from 'react'

// Components
import PlaylistHeader from '../PlaylistHeader'
import PlaylistScroller from '../PlaylistScroller'
import SearchBar from '../SearchBar'
import SearchResult from '../SearchResults'

// Local
import './index.scss';
import { PlaylistInfoForm } from './playlist-info';
import { VideoInfoForm } from './video-info'

// Types
import type { Result } from 'ytsr'

export function Editor() {
  type LeftPanel = 'PlaylistInfoForm' | 'VideoInfoForm' | 'SearchResult'
  const [leftPanel, setLeftPanel] = useState<LeftPanel>('PlaylistInfoForm')

  const [currentUID, setcurrentUID] = useState<string>(undefined)
  const [searchResults, setSearchResults] = useState<Result>(undefined)

  return (
    <span className="editor-container">
      <span className="left-side">
        {(() => {
          if (leftPanel === 'PlaylistInfoForm') return (
            <PlaylistInfoForm />
          )
          if (leftPanel === 'VideoInfoForm') return (
            <VideoInfoForm
              uid={currentUID}
            />
          )
          return (
            <SearchResult
              result={searchResults}
            />
          )
        })()}
      </span>

      <span className="right-side">
        <PlaylistHeader
          onSelect={() => setLeftPanel('PlaylistInfoForm')}
          selected={(leftPanel === 'PlaylistInfoForm')}
        />

        <PlaylistScroller
          onSelect={(video) => {
            setcurrentUID(video.uid)
            setLeftPanel('VideoInfoForm')
          }}
          selected={(leftPanel === 'VideoInfoForm')}
          deselect={(video) => {
            if (video.uid === currentUID) setLeftPanel('PlaylistInfoForm')
          }}
        />

        <SearchBar
          onSearch={(res: Result) => {
            setSearchResults(res)
            setLeftPanel('SearchResult')
          }}
        />
      </span>
    </span>
  )
}