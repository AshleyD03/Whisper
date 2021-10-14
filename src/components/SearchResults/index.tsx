import React from 'react'
import './index.scss'

import type { Result } from 'ytsr'
import {Playlist_Item, Video_Item} from './items'
import { uuidv4 } from '../../modules/uuid'

export default function ({ result } : { result: Result}) {
  return (
    <span className="search-list">
      <span className="header">
        <h2>
          Search results for...
        </h2>
        <h1>
          {result.originalQuery}
        </h1>
      </span>

      <ul>
        {result.items.map(item => {
          switch (item.type) {
            case 'video':
              return <Video_Item item={item} key={uuidv4()}/>
            case 'playlist':
              return <Playlist_Item item={item} key={uuidv4()}/>
            default:
              return (null)  
          }
        })}
      </ul>
    </span>
  )
}