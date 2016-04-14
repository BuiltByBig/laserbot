import stateMachine from '~/lib/gcode-state-machine'

describe('lib/gcode-stateMachine', () => {
  let machine

  beforeEach(() => {
    machine = stateMachine()
  })

  it('should change X, Y and Z', () => {
    expect(machine('G0 X5 Y10 Z15')).to.deep.equal({
      distanceMode: 'relative',
      history: [
        'G0 X5 Y10 Z15',
      ],
      spindleEnabled: false,
      spindleSpeed: null,
      x: 5,
      y: 10,
      z: 15,
    })
  })

  it('should update state over time', () => {
    expect(machine('G0 X5 Y10 Z15')).to.deep.equal({
      distanceMode: 'relative',
      history: [
        'G0 X5 Y10 Z15',
      ],
      spindleEnabled: false,
      spindleSpeed: null,
      x: 5,
      y: 10,
      z: 15,
    })

    expect(machine('G0 X-10 Y5 Z-5')).to.deep.equal({
      distanceMode: 'relative',
      history: [
        'G0 X5 Y10 Z15',
        'G0 X-10 Y5 Z-5',
      ],
      spindleEnabled: false,
      spindleSpeed: null,
      x: -5,
      y: 15,
      z: 10,
    })
  })

  it('should handle spindle speed', () => {
    expect(machine('G0 X10 S150')).to.deep.equal({
      distanceMode: 'relative',
      history: [
        'G0 X10 S150',
      ],
      spindleEnabled: false,
      spindleSpeed: 150,
      x: 10,
      y: 0,
      z: 0,
    })
    expect(machine('G0 X5 S500')).to.deep.equal({
      distanceMode: 'relative',
      history: [
        'G0 X10 S150',
        'G0 X5 S500',
      ],
      spindleEnabled: false,
      spindleSpeed: 500,
      x: 15,
      y: 0,
      z: 0,
    })
  })

  it('should handle spindle on/off', () => {
    expect(machine('M3')).to.deep.equal({
      distanceMode: 'relative',
      history: [
        'M3',
      ],
      spindleEnabled: true,
      spindleSpeed: null,
      x: 0,
      y: 0,
      z: 0,
    })
    expect(machine('M5')).to.deep.equal({
      distanceMode: 'relative',
      history: [
        'M3',
        'M5',
      ],
      spindleEnabled: false,
      spindleSpeed: null,
      x: 0,
      y: 0,
      z: 0,
    })
  })

  it('should accept a passed in state object', () => {
    const initialState = {
      distanceMode: 'relative',
      history: [
        'M3',
        'G0 X10 Y10 Z10 S200',
        'M5',
      ],
      spindleEnabled: true,
      spindleSpeed: 200,
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

  it('should handle different distance modes', () => {
    machine('G90')
    machine('G0 X10 Y10 Z10')
    expect(machine('G0 X5 Y5 Z5')).to.deep.equal({
      distanceMode: 'absolute',
      history: [
        'G90',
        'G0 X10 Y10 Z10',
        'G0 X5 Y5 Z5',
      ],
      spindleEnabled: false,
      spindleSpeed: null,
      x: 5,
      y: 5,
      z: 5,
    })
  })

  xit('should handle setting units', () => {
    // G20 = inchces, G21 = mm
  })

  xit('should handle coolant', () => {
   // M7,8,9
  })

  xit('should handle tool changes', () => {
    // M6, T commands
  })

  xit('should handle program start/stop', () => {
    //M0 program stop
    //- pause temporarily
    //M1 optional program stop
    //M2 program end
    //- coolant, spindle off, absolute mode
    //M3 turn spindle clockwise
    //M4 turn spindle counterclockwise
    //M5 stop spindle turning
    //M6 tool change
    //M7 mist coolant on
    //M8 flood coolant on
    //M9 mist and flood coolant off
    //M30 program end, pallet shuttle, and reset
    //M48 enable speed and feed overrides
    //M49 disable speed and feed overrides
    //M60 pallet shuttle and program stop
  })

})
