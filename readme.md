# Laserbot Client

> Laserbot React client application

![screenshot](http://f.cl.ly/items/1m200F1a2q0u2D3J2W1f/Screen%20Shot%202016-04-08%20at%2010.41.22%20PM.png)

## Features

- Convert `.svg`, `.jpg`, `.png`, `.gif` files to Gcode
- Show current machine state and position
- Send gcode directly to the machine
- Load Gcode files
- Keyboard shortcuts:
  - `spacebar` -- Pause/resume (aka feedhold/cycle start)
  - `up/down/left/right` -- Jog machine 1mm in X/Y
- Set grbl config settings via a UI
- Home machine


## Usage

```bash
nvm use
nvm install
npm install
npm run watch
```


## Todos

- [ ] Preview gcode
- [ ] Resize, rotate, flip operations
- [ ] Drag + drop support
- [ ] Keyboard shortcuts:
- [ ] Change jog increment value
- [ ] Store files in localstorage
- [ ] Store config in localstorage
- [ ] Clear the console


## License

[MIT](license) by [Dana Woodman](http://danawoodman.com)
