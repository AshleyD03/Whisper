import React from "react";
import { Download_Settings, FileFormat } from "../typings/Download";
import { VideoMetaData } from "../typings/ipcRenderer";
import { Playlist, Video } from "../typings/Playlist";

/*
  A very messy function to ensure that
  the download is up to standards
*/
export function verify_download_settings(playlist: Playlist, settings: Download_Settings): string | true {
  
  if (!playlist.title) return 'Missing a title'
  if (!playlist.author) return 'Missing an Author'

  if (
    !playlist.cover.file ||
    !playlist.cover.dataURL ||
    !playlist.cover.alt
  ) return 'Missing Cover Image'

  if (
    !playlist.videos ||
    playlist.videos.length < 1
  ) return 'Playlist is Empty'

  return true
}

export async function make_dir (path: string, title: string): Promise<string | false> {
  const newPath = `${path}\\${title}`
    if (!(await ipcRenderer.invoke('mkdir', newPath))) return false
    return newPath
}

export async function download_yt (playlist: Playlist, index: number, path: string, fileFormat: FileFormat) {
  
  const video = playlist.videos[index]
  const metadata: VideoMetaData = {
    artist: video.author,
    title: video.title,
    album_artist: playlist.author,
    album: playlist.title,
    track: index + 1
  }

  return await ipcRenderer.invoke('download-youtube', [video.url, metadata, path, fileFormat])
}

export async function download_img (src: string, path: string) {

  console.log(src)
  const img = document.createElement('img')
  img.src = src

  const canvas = document.createElement('canvas')
  canvas.width = img.width;
  canvas.height = img.height;
  canvas.getContext('2d').drawImage(img, 0, 0)

  const dataUrl = canvas.toDataURL('image/png')
  return await ipcRenderer.invoke('download-img', [`${path}\\cover.png`, dataUrl])
}