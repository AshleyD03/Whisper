export type Button = {
  name: string,
  hint?: string, 
  keybind?: string,
  func?: () => void
}

export type Option = Button | 'line'

export type Dropdown = {
    name: string,
    items: Array<Option> 
}