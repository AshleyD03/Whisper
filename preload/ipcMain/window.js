const { BrowserWindow, dialog } = require('electron')

function getWindow(e) {
  return BrowserWindow.fromWebContents(e.sender)
}

module.exports = {
  "window-minimize": {
    type: 'on',
    func: e => getWindow(e).minimize()
  },
  "window-close": {
    type: 'on',
    func: e => getWindow(e).close()
  },
  "window-maximize": {
    type: 'on',
    func: e => {
      const win = getWindow(e);
      if (win.isMaximized()) win.restore()
      else win.maximize()
    }
  },
  'get-dialog': {
    type: 'handle',
    func: async (_, options) => await dialog.showOpenDialog(options)
  }
}