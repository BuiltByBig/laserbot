import parser from '~/lib/parse-gcode'

describe('lib/gcode-parser', () => {

  it('should ignore comments', () => {
    expect(parser('; Hello world!')).to.deep.equal({
      number: null,
      words: []
    })
  })

  it('should break command into word segments', () => {
    expect(parser('G0 X10')).to.deep.equal({
      number: null,
      words: [
        [ 'G', 0 ],
        [ 'X', 10 ],
      ]
    })
  })

  it('should handle line numbers', () => {
    expect(parser('N100 G0 X10')).to.deep.equal({
      number: 100,
      words: [
        [ 'G', 0 ],
        [ 'X', 10 ],
      ]
    })
  })

  xit('should uppercase commands', () => {

  })
})
