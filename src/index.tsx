import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { App } from './App';
import './index.scss';

console.log(ipcRenderer)

ReactDOM.render((
  <App></App>
), document.getElementById('root'))