import React, { useState, useContext, createContext } from 'react'
import './index.scss';

import { ThemeContext } from '../../App';
import type { ModalHook, PageKey, PageKeyHook } from './types';
import { Frame } from '../Frame'

export const WindowContext = createContext<PageKeyHook>(null)
export const ModalContext = createContext<ModalHook>(null)

export function Window({ children }: { children: Array<JSX.Element> }) {

  const [theme] = useContext(ThemeContext)

  // Page State
  let pages: { [key: string]: JSX.Element } = {};
  children.forEach(ele => pages[ele.type.name] = ele)
  const [pageKey, setPageKey] = useState<PageKey>('Editor')

  // Modal State
  const [modal, setModal] = useState<JSX.Element>(null)
  const [modalVis, setModalVis] = useState<boolean>(false)
  const callModal = (children: JSX.Element) => {
    setModal(<>{children}</>)
    setModalVis(true)
  }
  const toggleModal = () => setModalVis(!modalVis)

  return (
    <WindowContext.Provider value={[pageKey, setPageKey]}>
      <ModalContext.Provider value={[callModal, toggleModal]}>
        <Frame/>
        <div style={{ 'background': `#${theme}94` }} className="window-container">
          <span className={`backdrop ${modalVis}`} onClick={toggleModal}> {modal} </span>
          {pages[pageKey]}
        </div>
      </ModalContext.Provider>
    </WindowContext.Provider>
  )
}