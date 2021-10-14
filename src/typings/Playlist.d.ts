export type Video = {
  title: string,
  author: string,
  url: string,
  uid: string
}
export type SetVideo = React.Dispatch<React.SetStateAction<Video>>

export type Cover = {
  file?: File,
  dataURL?: string,
  alt?: string
}

export type Playlist = {
  title: string,
  author: string, 
  cover: Cover,
  videos: Array<Video>
}
export type EmptyPlaylist = Partial<Playlist>
export type SetPlaylist = React.Dispatch<React.SetStateAction<Playlist>>
export type PlaylistHook = [Playlist, React.Dispatch<React.SetStateAction<Playlist>>]