import Application from './containers/application'
import React from 'react'
import { render } from 'react-dom'
import './styles/index.scss'

const root = document.getElementById('app')

render(<Application />, root)
