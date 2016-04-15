import stateMachine from '~/lib/gcode-state-machine'

describe('lib/gcode-stateMachine', () => {
  let machine

  beforeEach(() => {
    machine = stateMachine()
  })

  it('should accept a passed in state object', () => {
    const initialState = {
      coolant: false,
      distanceMode: 'relative',
      history: [
        'M3',
        'G0 X10 Y10 Z10 S200',
        'M5',
      ],
      spindleDirection: 'clockwise',
      spindleEnabled: true,
      spindleSpeed: 200,
      stopped: false,
      units: 'mm',
      x: 10,
      y: 10,
      z: 10,
    }
    const expected = Object.assign({}, initialState, {
      history: [
        'M3',
        'G0 X10 Y10 Z10 S200',
        'M5',
        'G0 X-10',
      ],
      x: 0,
    })
    expect(machine('G0 X-10', initialState)).to.deep.equal(expected)
  })

  it('should handle resetting work offsets', () => {
    machine('G0 X5 Y10 Z15')
    expect(machine('G92 X0').x).to.equal(0)
    expect(machine('G92 Y0').y).to.equal(0)
    expect(machine('G92 Z0').z).to.equal(0)
  })

  it('should handle an array of commands', () => {
    const state = machine([
      'G0 X5',
      'G0 Y10',
    ])
    expect(state.x).to.equal(5)
    expect(state.y).to.equal(10)
  })

  it('should work with lowercase command letters', () => {
    const state = machine([
      'g0 x5',
      'g0 y10',
    ])
    expect(state.x).to.equal(5)
    expect(state.y).to.equal(10)
  })

  it('should change X, Y and Z', () => {
    const state = machine('G0 X5 Y10 Z15')
    expect(state.x).to.equal(5)
    expect(state.y).to.equal(10)
    expect(state.z).to.equal(15)
  })

  it('should add each new command to the history', () => {
    expect(machine('G0 X5 Y10 Z15').history).to.deep.equal([
      'G0 X5 Y10 Z15',
    ])

    expect(machine('G0 X-10 Y5 Z-5').history).to.deep.equal([
      'G0 X5 Y10 Z15',
      'G0 X-10 Y5 Z-5',
    ])
  })

  it('should handle spindle speed', () => {
    expect(machine('G0 X10 S150').spindleSpeed).to.equal(150)
    expect(machine('G0 X5 S500').spindleSpeed).to.equal(500)
    expect(machine('G0 X5 S0').spindleSpeed).to.equal(0)
  })

  it('should handle spindle on/off and direction', () => {
    expect(machine('M3').spindleEnabled).to.be.true
    expect(machine('M5').spindleEnabled).to.be.false
    expect(machine('M4').spindleEnabled).to.be.true
  })

  it('should handle spindle direction', () => {
    expect(machine('M4').spindleDirection).to.equal('counter')
    expect(machine('M3').spindleDirection).to.equal('clockwise')
  })

  it('should handle different distance modes', () => {
    machine('G90')
    machine('G0 X10 Y10 Z10')
    const state = machine('G0 X5 Y5 Z5')
    expect(state.distanceMode).to.equal('absolute')
    expect(state.x).to.equal(5)
    expect(state.y).to.equal(5)
    expect(state.z).to.equal(5)
  })

  it('should handle setting units', () => {
    expect(machine('G21').units).to.equal('in')
    expect(machine('G20').units).to.equal('mm')
  })

  it('should handle coolant', () => {
    expect(machine('M7').coolant).to.equal('mist')
    expect(machine('M8').coolant).to.equal('flood')
    expect(machine('M9').coolant).to.be.false
  })

  it('should handle program start/stop', () => {
    expect(machine('M0').stopped).to.be.true
    //M1 optional program stop
    //M2 program end
    //- coolant, spindle off, absolute mode
    //M6 tool change
    //M30 program end, pallet shuttle, and reset
    //M48 enable speed and feed overrides
    //M49 disable speed and feed overrides
    //M60 pallet shuttle and program stop
  })

  xit('should handle tool changes', () => {
    // M6, T commands
  })

})
