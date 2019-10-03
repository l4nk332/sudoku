import React from 'react'
import ReactDOM from 'react-dom'

import './index.css'

import { Sudoku } from './containers'

const App = () => <Sudoku />

ReactDOM.render(<App />, document.getElementById('app'))

module.hot.accept()
