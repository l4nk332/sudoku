import React from 'react'
import ReactDOM from 'react-dom'

import './index.css'

import Grid from './Grid/Grid'

const App = () => <Grid />

ReactDOM.render(<App />, document.getElementById('app'))

module.hot.accept()
