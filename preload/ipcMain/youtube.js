const ytdl = require('ytdl-core');
const ytpl = require('ytpl');
const ytsr = require('ytsr');

module.exports = {
  "youtube-search": {
    type: 'handle',
    func: async (_, arg) => {

      if (ytdl.validateURL(arg)) {
        return {
          type: 'video',
          payload: (await ytdl.getBasicInfo(arg)).videoDetails
        }
      }

      return ytpl(arg)
        .then(playlist => {
          return {
            type: 'playlist',
            payload: playlist.items
          }
        })
        .catch(async err => {
          return {
            type: 'search',
            payload: await ytsr(arg)
          }
        })
    }
  }
}