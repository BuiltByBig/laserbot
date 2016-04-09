import _ from 'lodash'
import FA from 'react-fontawesome'
import FormField from './form-field'
import React, { PropTypes } from 'react'

export default React.createClass({

  name: 'GrblSettings',

  propTypes: {
    config: PropTypes.object.isRequired,
    hideSettings: PropTypes.func.isRequired,
    updateConfig: PropTypes.func.isRequired,
  },

  getInitialState() {
    return this.props.config
  },

  async _saveSettings(e) {
    e.preventDefault()
    await this.props.updateConfig(this.state)
  },

  _updateSetting(key, val) {
    this.state[key] = val
    this.setState(this.state)
  },

  _hideSettings(e) {
    e.preventDefault()
    this.props.hideSettings()
  },

  render() {

    // Grbl defaults:
    //$0=10 (step pulse, usec)
    //$1=25 (step idle delay, msec)
    //$2=0 (step port invert mask:00000000)
    //$3=0 (dir port invert mask:00000000)
    //$4=0 (step enable invert, bool)
    //$5=0 (limit pins invert, bool)
    //$6=0 (probe pin invert, bool)
    //$10=1 (status report mask:00000001)
    //$11=0.010 (junction deviation, mm)
    //$12=0.002 (arc tolerance, mm)
    //$13=0 (report inches, bool)
    //$20=0 (soft limits, bool)
    //$21=0 (hard limits, bool)
    //$22=0 (homing cycle, bool)
    //$23=0 (homing dir invert mask:00000000)
    //$24=25.000 (homing feed, mm/min)
    //$25=500.000 (homing seek, mm/min)
    //$26=250 (homing debounce, msec)
    //$27=1.000 (homing pull-off, mm)
    //$100=250.000 (x, step/mm)
    //$101=250.000 (y, step/mm)
    //$102=250.000 (z, step/mm)
    //$110=500.000 (x max rate, mm/min)
    //$111=500.000 (y max rate, mm/min)
    //$112=150.000 (z max rate, mm/min)
    //$120=10.000 (x accel, mm/sec^2)
    //$121=10.000 (y accel, mm/sec^2)
    //$122=10.000 (z accel, mm/sec^2)
    //$130=200.000 (x max travel, mm)
    //$131=200.000 (y max travel, mm)
    //$132=200.000 (z max travel, mm)<F37>

    return (
      <form
        onSubmit={this._saveSettings}
      >
        <FormField
          label='$100 - X steps/mm'
          onChange={(e) => this._updateSetting('$100', e.target.value)}
          value={this.state['$100']}
        />
        <FormField
          label='$101 - Y steps/mm'
          onChange={(e) => this._updateSetting('$101', e.target.value)}
          value={this.state['$101']}
        />
        <FormField
          label='$110 - Y Max Speed (mm/min)'
          onChange={(e) => this._updateSetting('$110', e.target.value)}
          value={this.state['$110']}
        />
        <FormField
          label='$111 - Y Max Speed (mm/min)'
          onChange={(e) => this._updateSetting('$111', e.target.value)}
          value={this.state['$111']}
        />
        <button
          className='btn btn-lg btn-primary'
          onClick={this._saveSettings}
        >
          Save Settings
        </button>
        <button
          className='btn btn-lg btn-link m-l-2'
          onClick={this._hideSettings}
        >
          Cancel
        </button>
      </form>
    )
  },

})
