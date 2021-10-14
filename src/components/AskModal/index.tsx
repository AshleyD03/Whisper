import React, { useContext } from 'react'
import './index.scss'

import { ThemeContext } from '../../App';
import { ModalContext } from '../Window';

export default function Ask_Modal({ header='Wait a sec...', msg='No Message ;-;', options = [] }: {  header?: string, msg?: string, options: { name: string, onClick?: () => void }[] }) {

  const [theme] = useContext(ThemeContext)
  const toggle = useContext(ModalContext)[1]

  return (
    <span 
      className='accept-box' 
      style={{ backgroundColor: `#${theme}` }}
      onClick={e => e.stopPropagation()}
    >
      <span className='header'>
        <h3> {header} </h3>
        <h1> {msg} </h1>
      </span>
      <ul>
        {options.map(opt => (
          <li 
            key={opt.name}
            onClick={() => {
              toggle()
              if (opt.onClick) opt.onClick()
            }}
          >
            {opt.name}
          </li>
        ))}
      </ul>
    </span>
  )
}