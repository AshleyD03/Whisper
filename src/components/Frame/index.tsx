import React, { useState, useContext } from 'react'
import './index.scss';

import MinimizeIcon from '@material-ui/icons/Minimize'
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank'
import CloseIcon from '@material-ui/icons/Close'

import { ThemeContext } from '../../App';
import type { Dropdown } from './types'
import { WindowContext } from '../Window';

export function Frame() {
  const [pageKey, setPageKey] = useContext(WindowContext)
  const [theme, setTheme] = useContext(ThemeContext)
  const [visible, setVisible] = useState(false)

  const PRESET: Array<Dropdown> = [
    {
      name: 'File',
      items: [,
        {
          name: 'Editor',
          hint: 'Ctrl + E',
          func: () => setPageKey('Editor')
        },
        {
          name: 'Download',
          hint: 'Ctrl + D',
          func: () => setPageKey('DownloadSettings')
        }
      ]
    }
  ]

  return (
    <div
      style={{ 'background': `#${theme}` }}
      className="frame"
    >
      <img
        className="logo"
        src="./static/images/logo_white.svg" />

      <span
        className={`visible-${visible}` + ' dropdown-container group'}
        onClick={() => setVisible(!visible)}>
        {PRESET.map(cate => (
          <DropDown
            category={cate}
            theme={theme}
            key={cate.name}
          />
        ))}
      </span>

      <span className="group">
        <span
          className="resize"
          onClick={() => ipcRenderer.send('window-minimize')}>
          <MinimizeIcon></MinimizeIcon>
        </span>
        <span
          className="resize"
          onClick={() => ipcRenderer.send('window-maximize')}>
          <CheckBoxOutlineBlankIcon></CheckBoxOutlineBlankIcon>
        </span>
        <span
          className="close"
          onClick={() => ipcRenderer.send('window-close')}>
          <CloseIcon></CloseIcon>
        </span>
      </span>
    </div>
  )
}

function DropDown({ category, theme }: { category: Dropdown, theme: string }) {

  return (
    <span className="dropdown">
      <span className="opening">
        {category.name}
      </span>
      <ul
        style={{ background: `#${theme}` }}
      >
        {category.items.map(opt => {
          if (typeof opt === 'string') return (
            <li className="line" />
          )

          else return (
            <li
              className="option"
              key={opt.name}
              onClick={() => {
                if (opt.func) opt.func()
              }}
            >
              <span> {opt.name} </span>
              <span> {opt.hint} </span>
            </li>
          )
        })}
      </ul>
    </span>
  )
}