import React from "react";

export type PageKey = 'Home' | 'Editor' | 'DownloadSettings' | 'DownloadProgress';
export type PageKeyHook = [PageKey, React.Dispatch<React.SetStateAction<PageKey>>]

export type ModalHook = [ 
  (children: JSX.Element) => void, 
  () => void
]