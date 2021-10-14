import React, { useState, createContext } from 'react';

import { Window } from './components/Window'
import { Editor } from './components/Editor'
import { Home } from './components/Home'
import DownloadSettings from './components/DownloadSettings';

import type { Playlist, PlaylistHook } from './typings/Playlist'
import { Download_Settings, Download_Settings_Hook } from './typings/Download';
import DownloadProgress from './components/DownloadProgress';

export const PlaylistContext = createContext<PlaylistHook>(null)
export const ThemeContext = createContext<[string, React.Dispatch<React.SetStateAction<string>>]>(null)
export const DownloadContext = createContext<Download_Settings_Hook>(null)

export function App() {

  const playlistHook = useState<Playlist>({
    title: '',
    author: '',
    videos: [],
    cover: {}
  })

  /* Colours I like
    -046464
    -3c6543
    -646464
    -435ff3
    -a23434
  */
  const themeHook = useState<string>('a23434')

  const downloadSettingsHook = useState<Download_Settings>({
    fileFormat: 'mp3',
    path: './',
    library: false
  })

  return (
    <ThemeContext.Provider value={themeHook}>
      <PlaylistContext.Provider value={playlistHook}>
        <DownloadContext.Provider value={downloadSettingsHook}> 
          <Window>
            <Home/>
            <Editor/>
            <DownloadSettings/>
            <DownloadProgress/>
          </Window>
        </DownloadContext.Provider>
      </PlaylistContext.Provider>
    </ThemeContext.Provider>
  )
}