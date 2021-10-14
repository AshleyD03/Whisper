import type ytdl from 'ytdl-core'
import type ytpl from 'ytpl'
import type ytsr from 'ytsr'
import { OpenDialogOptions, OpenDialogReturnValue } from 'electron'
import { Playlist } from './Playlist'

export type SearchResult =
  { type: 'video', payload: ytdl.MoreVideoDetails } |
  { type: 'playlist', payload: ytpl.Item[] } |
  { type: 'search', payload: ytsr.Result }

export type DownloadFormats = 'mp4' | 'mp3' | 'webm'
export type VideoMetaData = {
  artist: string,
  title: string,
  album_artist: string,
  album: string,
  track: number
}

export interface Custom_Render {
  send: 
  (channel: 'window-minimize' | 'window-close' | 'window-maximize') => void,

  invoke:
  ((channel: 'get-dialog', arg: OpenDialogOptions) => Promise<OpenDialogReturnValue>) &
  ((channel: 'youtube-search', arg: string) => Promise<SearchResult>) &
  ((channel: 'download-youtube', arg: [url: string, meta: VideoMetaData, path: string, type: DownloadFormats]) => Promise<boolean>) &
  ((channel: 'mkdir', arg: string) => Promise<boolean>) &
  ((channel: 'download-img', arg: [path: string, base64Data: string]) => Promise<boolean>) &
  ((channel: 'export-itunes', arg: [playlist: Playlist, fileFormat: DownloadFormats, path: string]) => Promise<null>),
}

declare global {
  const ipcRenderer: Custom_Render;
}