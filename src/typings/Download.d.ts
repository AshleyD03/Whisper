export type FileFormat = 'mp3' | 'mp4' | 'webm'
export type DownloadLibrary = 'iTunes' | false

export type Download_Settings = {
  fileFormat: FileFormat,
  path: string
}
export type Download_Settings_Hook = [Download_Settings, React.Dispatch<React.SetStateAction<Download_Settings>>]