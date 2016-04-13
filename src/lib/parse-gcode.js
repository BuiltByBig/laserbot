/**
 * G - motion and settings
 * F - set feed rate
 * S - set spindle speed
 * T - select tool
 */
export default (command) => {

  // Remove leading and trailing whitespace
  let cmd = command.trim()

  let response = {
    number: null,
    words: [],
  }

  if (cmd.startsWith(';')) {
    return response
  }

  // Get each "word" of the gcode block
  const words = cmd.split(' ')

  // Handle line numbers differently
  if (words[0].startsWith('N')) {
    response.number = Number(words[0].slice(1))

    // Remove line number from list of commands
    words.shift()
  }

  response.words = words.map((chunk) => {
    const letter = chunk.slice(0, 1)
    const argument = Number(chunk.slice(1))
    return [ letter, argument ]
  })

  return response
}
