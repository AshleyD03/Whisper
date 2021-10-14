import React, { useRef, useState, useContext, FormEvent, useEffect } from 'react'
import './index.scss'

import PlaylistHeader from '../PlaylistHeader'
import PlaylistScroller from '../PlaylistScroller'
import { DownloadContext, PlaylistContext } from '../../App'
import { DropDownInput, DialogInput } from '../Inputs'
import type { FileFormat, DownloadLibrary } from '../../typings/Download'
import WarningIcon from '@material-ui/icons/Warning'
import { verify_download_settings } from '../../modules/download'
import { ModalContext, WindowContext } from '../Window'
import Ask_Modal from '../AskModal'

export default function DownloadSettings() {

  // Upper Context
  const [settings, setSettings] = useContext(DownloadContext)
  const [playlist] = useContext(PlaylistContext)
  const [_, setPageKey] = useContext(WindowContext)
  const [callModal] = useContext(ModalContext)

  // Form fields
  const formatRef = useRef<HTMLInputElement>()
  const formats: FileFormat[] = ['mp3', 'mp4', 'webm']

  const dialogRef = useRef<HTMLInputElement>()

  const libraryRef = useRef<HTMLInputElement>()
  const libraries: DownloadLibrary[] = [false, 'iTunes']

  // Indication of verification
  const [errorMsg, setErrorMsg] = useState<string>(null)

  useEffect(() => {
    const verify = verify_download_settings(playlist, settings)
    if (verify !== true) setErrorMsg(verify)
    else setErrorMsg('')
  }, [playlist, settings])

  // Event
  function onSubmit(e: FormEvent) {
    e.preventDefault()
    setPageKey('DownloadProgress')
  }

  return (
    <span className="download-container">
      <span className="left-side">
        <form
          className="form"
          onSubmit={onSubmit}
        >

          <h2> Required* </h2>
          <DropDownInput
            title='File Format'
            refHook={formatRef}
            options={formats}
            preset={settings.fileFormat}
            onUpdate={(format) => setSettings({
              ...settings,
              fileFormat: String(format) as FileFormat
            })}
          />
          <DialogInput
            title='Location'
            refHook={dialogRef}
            defaultValue='./'
            onUpdate={(path) => setSettings({
              ...settings,
              path: path
            })}
          />

          <span className="submit">
            {(errorMsg) ? (<>
              <WarningIcon 
                onClick={() => callModal(
                <Ask_Modal
                  header='huh...'
                  msg={errorMsg}
                  options={[
                    { name: 'Close' }
                  ]}
                />)}
              />
              <span> {errorMsg} </span>
            </>) : (<></>)}
            <button
              disabled={errorMsg !== ''}
            > confirm </button>

          </span>
        </form>
      </span>
      <span className='right-side'>
        <PlaylistHeader disabled={true} />
        <PlaylistScroller disabled={true} />
      </span>
    </span>
  )
}