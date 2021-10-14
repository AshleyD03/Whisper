const ytdl = require('ytdl-core')
const ffmpeg = require('fluent-ffmpeg')
const ffmetadata = require('ffmetadata')
ffmpeg.setFfmpegPath(require('ffmpeg-static-electron').path)
ffmpeg.setFfprobePath(require('ffprobe-static-electron').path)
ffmetadata.setFfmpegPath(require('ffmpeg-static-electron').path)
const fs = require('fs')

module.exports = {
  'mkdir': {
    type: 'handle',
    func: async (_, path) => new Promise(async (res) => {

      // Pass duplicate 
      path = path.replace(/[?%*|'"<>]/g, '')
      if (fs.existsSync(path)) return res(true)

      console.log(path)
      // Return if worked
      fs.mkdir(path, err => {
        console.log(err)
        res(!(err))
      })
    })
  },
  'download-youtube': {
    type: 'handle',
    func: async (event, [url, meta, path = './test', type = 'mp3']) => {
      
      path += `\\${meta.title}.${type}`
      path = path.replace(/[?%'*|"<>]/g, '')

      console.log(path)
      
      try {
        // Download File
        const result = await (async () => new Promise((res, rej) => {
          switch (type) {
            case 'mp4':
            case 'webm':
              ytdl(url, { filter: format => format.container === type })
                .on('end', () => res(true))
                .on('error', () => res(false))
                .pipe(fs.createWriteStream(path))
              break
            case 'mp3':
              
              console.log('donwloading')
              const proc = new ffmpeg({
                source: ytdl(url, { filter: 'audioonly' })
              })
              proc.on('end', () => res(true))
              proc.on('error', () => res(false))
              proc.saveToFile(path)
              break
          }
        }))()
        if (!result) return false

        // Write metadata
        await new Promise((res, rej) => {
          ffmetadata.write(path, meta, err => {
            if (err) rej(err)
            res()
          })
        })

        return true
      } catch (err) { return false }
    }
  },
  'download-img': {
    type: 'handle',
    func: async (_, [path, dataUrl]) => {
      path = path.replace(/[?%*'|"<>]/g, '')

      const data = dataUrl.replace(/^data:image\/\w+;base64,/, '')
      const buf = Buffer.from(data, 'base64')
      
      return fs.writeFile(path, buf, err => {
        if (err) return false
        return true
      })
    }
  }
}