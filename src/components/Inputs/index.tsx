import React, { MutableRefObject, FocusEvent, useState, useRef, FC } from "react";
import './index.scss'

import { ArrowDropDown, RadioButtonChecked, RadioButtonUnchecked, FolderOpen, Folder } from '@material-ui/icons'

interface TextProps {
  title: string,
  refHook: MutableRefObject<HTMLInputElement>,
  defaultValue: string,
  onUpdate?: (e: FocusEvent<HTMLInputElement>) => void
}
export const TextInput: FC<TextProps> = ({
  title, refHook, defaultValue,
  onUpdate = () => { }
}) => {
  return (
    <label className='input input-text'>
      <span className="title"> {title} </span>
      <span className="text-container">
        <input
          ref={refHook}
          defaultValue={defaultValue}
          placeholder="title"
          type="text"
          onBlur={onUpdate}
        />
      </span>
    </label>
  )
}



interface DropDownProps {
  title: string,
  refHook: MutableRefObject<HTMLInputElement>,
  options: Array<string | number | boolean>,
  preset?: string | number | boolean,
  onUpdate?: (value: string | number | boolean ) => void
}
export const DropDownInput: FC<DropDownProps> = ({
  title, refHook, options, preset,
  onUpdate = () => { } }) => {

  if (options.length < 1) options = ['Empty']
  if (!options.includes(String(preset))) preset = options[0]

  const [value, setValue] = useState(preset)
  const [visisble, setVisible] = useState(false)

  function toggle(e: React.MouseEvent) {
    e.stopPropagation();
    setVisible(!visisble)
  }

  function chooseOption(value: string | number | boolean) {
    setValue(value)
    onUpdate(value)
  }

  function clickOff() {
    setTimeout(() => {
      setVisible(false)
    }, 100)
  }

  function getTitle(value: string | number | boolean) {
    switch (value) {
      case true:
        return 'Yes Please'
      case false:
        return 'No Thanks'
      default:
        return String(value)
    }
  }

  return (
    <label
      className="input input-dropdown"
      onClick={toggle}
    >
      <span className="title"> {title} </span>

      <span className="text-container">
        <input
          type="text"
          ref={refHook}
          readOnly={true}
          value={getTitle(value)}
          onBlur={clickOff}
        />
        <ArrowDropDown
          className={visisble ? 'rot-true' : ''}
        />
      </span>

      <ul className={`drop vis-${visisble}`}>
        {options.map(val => (
          <li
            key={getTitle(val)}
            onClick={() => chooseOption(val)}
          >
            <span> {getTitle(val)} </span>
            {val === value ? (<RadioButtonChecked />) : (<RadioButtonUnchecked />)}
          </li>
        ))}
      </ul>
    </label>
  )
}



interface DialogProps {
  title: string,
  refHook: MutableRefObject<HTMLInputElement>,
  defaultValue?: string,
  onUpdate?: (path: string) => void
}
export const DialogInput: FC<DialogProps> = ({
  title, refHook,
  defaultValue = './',
  onUpdate = () => { }
}) => {

  const [value, setValue] = useState(defaultValue);
  const isLocked = useRef(false);

  async function onClick() {
    if (isLocked.current) return
    isLocked.current = true;
    const dialog = await ipcRenderer.invoke('get-dialog', {
      properties: ['openDirectory']
    })
    if (!dialog.canceled) {

      const path = dialog.filePaths.join('/')
      setValue(path)
      onUpdate(path)
    }
    isLocked.current = false
  }

  return (
    <label
      className='input input-dialog'
      onClick={onClick}
    >
      <span className="title"> {title} </span>
      <span className="text-container">
        <input
          ref={refHook}
          value={value}
          readOnly={true}
          placeholder="title"
          type="text"
        />
        {value === './' ? (<FolderOpen />) : (<Folder />)}
      </span>
    </label>
  )
}