import { PropTypes } from 'react'

export const Device = PropTypes.shape({
  baud: PropTypes.string,
  location: PropTypes.string,
  name: PropTypes.string,
  open: PropTypes.bool,
})

export const StatusType = PropTypes.oneOf([
  'alarm',
  'check',
  'door',
  'error',
  'hold',
  'home',
  'idle',
  'run',
])
