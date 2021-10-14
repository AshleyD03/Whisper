const Shell = require('node-powershell')
const __path = require('path')

module.exports = {
  'export-itunes': {
    type: 'handle',
    func: async (_, [playlist, fileFormat, path]) => {

      const ps = new Shell({
        executionPolicy: 'Bypass',
        noProfile: true
      });

      const commands = [
        '$itunes = New-Object  -ComObject iTunes.Application',
        `$itunes.createPlaylist`
      ]

      const iconPath = __path.resolve(path, `cover.png`)
      playlist.videos.forEach(vid => {
        const title = vid.title.replace(/[?%:'*|"<>]/g, '')
        const mp3Path = __path.resolve(path, `${title}.${fileFormat}`)
        console.log(mp3Path, iconPath)

        // $track = $itunes.LibraryPlaylist.addFile("C:\Users\adoel\code\Electron\music\w\Pizzicato Five - Baby Love Child (L.A. English Mix Version).mp3")
        // $track.tracks::item(1).AddArtworkFromFile("C:\Users\adoel\code\Electron\music\w\cover.png")
        let cmds = [
          `$track = $itunes.LibraryPlaylist.addFile("${mp3Path}")`,
          `$track.tracks::item(1).AddArtworkFromFile("${iconPath}")`
        ]
        commands.push(...cmds)
      })

      
      commands.forEach(cmd => ps.addCommand(cmd))
      console.log(commands)
      await ps.invoke().catch(err => console.log(err))
      return
    }
  }
}