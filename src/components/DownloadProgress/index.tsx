import React, { useContext, useEffect, useRef, useState } from 'react'
import './index.scss'

import { DownloadContext, PlaylistContext } from '../../App'
import { download_yt, make_dir, verify_download_settings, download_img } from '../../modules/download'
import { ModalContext, WindowContext } from '../Window'
import Ask_Modal from '../AskModal'
import { makeFreshPlaylist } from '../../modules/Playlist'
import LoopIcon from '@material-ui/icons/Loop';

export default function DownloadProgress() {

  // Paramaters for download
  const [playlist, setPlaylist] = useContext(PlaylistContext)
  const [settings, setSettings] = useContext(DownloadContext)
  const status = useRef(false)
  const [isComplete, setIsComplete] = useState(false)

  // Change page / call modals
  const [_, setPageKey] = useContext(WindowContext)
  const [callModal] = useContext(ModalContext)

  // UI State
  const [percent, setPercent] = useState(0)
  const [message, setMessage] = useState('')
  const [index, setIndex] = useState(0)
  const [itunes, setItunes] = useState(false)

  function closeOnError(msg: string) {
    status.current = false;
    setPageKey('DownloadSettings')
    callModal(
      <Ask_Modal
        header='something went wrong...'
        msg={`Your download has been canceled due to: "${msg}"`}
        options={[
          { name: 'Close' }
        ]}
      />)
  }

  // Begin Download
  useEffect(() => {
    const verify = verify_download_settings(playlist, settings)
    if (verify === true) {

      setTimeout(async () => {

        // Initialise
        status.current = true;
        setPercent(0)

        // Make new folder
        const newPath = await make_dir(settings.path, playlist.title)
        if (!newPath) return closeOnError('Can\'t make dir')
        setSettings({
          ...settings,
          path: newPath
        })
        setMessage('Made Folder')
        setPercent(percent + 1)


        // Download image
        if (playlist.cover.dataURL) download_img(playlist.cover.dataURL, newPath)
        setPercent(percent + 1)


        // Loop through each video to download
        for (let i = 0; i < playlist.videos.length; i++) {
          if (!status.current) return

          setMessage(`Downloading... "${playlist.videos[i].title}"`)
          setIndex(i)

          const result = await download_yt(playlist, i, newPath ,settings.fileFormat)

          if (!result) return closeOnError('Problem Downloading Video')
          setMessage(`Added "${playlist.videos[i].title}" ✔️`)
          setPercent(percent + 1)
        }
        setIsComplete(true)
      }, 250)
    }
    else closeOnError(verify)
  }, [])

  return (
    <span className='download-progress-container'>
      {isComplete ? (
        <>
          <h1>
            All Complete
          </h1>
          <button
            onClick={() => {
              makeFreshPlaylist([playlist, setPlaylist])
              setPageKey('Editor')
            }}
          >
            Refresh
          </button>
          <button
            onClick={async (e) => {
              if (itunes) return
              const ele = e.currentTarget;
              ele.disabled = true;
              
              console.log(settings.path)
              ipcRenderer.invoke('export-itunes', [playlist, settings.fileFormat, settings.path])
              setItunes(true)
            }}
          >
            {itunes ? 'Done' : 'Add to Itunes'}
          </button>
        </>
      ) : (
        <>
          <span className='header'>
            <LoopIcon />
            <span className='message'>
              {message}
            </span>
            <span>
              {index}/{playlist.videos.length}
            </span>
          </span>
          <progress max={(playlist.videos.length + 2)} value={percent}/>
        </>
      )}
    </span>
  )
}