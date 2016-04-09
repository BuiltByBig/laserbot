import img from './images/square.svg'
import Snap from 'snapsvg'
import './styles/index.scss'

const container = Snap('#app')
const snap = Snap.load(img, (fragment) => {

  console.log('frag', fragment)

  container.add(fragment)

  fragment
    .selectAll('line')
    .forEach((line) => {
      console.log('line', line)
    })

  fragment
    .selectAll('path')
    .forEach((path) => {



      console.log('path', path)
      console.log('json', path.toJSON())



      path
        .click(function () {
          console.log('path', this)

          if (this.attr('selected') === 'true') {
            console.log('unselected')
            this.attr({
              selected: 'false',
              stroke: null,
              strokeWidth: 0,
            })
          } else {
            console.log('selected')
            this.attr({
              selected: 'true',
              stroke: 'rgba(95, 207, 198, 0.75)',
              strokeWidth: 3,
            })
          }
        })
        .mouseover(function () {
          this.attr({
            stroke: 'red',
            strokeWidth: 3,
          })
        })
        .mouseout(function () {
          if (this.attr('selected') === 'true') {
            this.attr({
              stroke: 'rgba(95, 207, 198, 0.75)',
              strokeWidth: 3,
            })
          } else {
            this.attr({
              selected: 'false',
              stroke: null,
              strokeWidth: 0,
            })
          }
        })
    })
})
    /*
    const component = this
    const container = Snap('#canvas')
    const snap = Snap.load(img, (fragment) => {
      console.log(fragment)
      container.add(fragment)
      fragment.selectAll('path')
              .forEach((path) => {
                path
                  .click(function () {
                    console.log('path', this)
                    if (this.attr('selected') === 'true') {
                      component.log('unselected')
                      this.attr({
                        selected: 'false',
                        stroke: null,
                        strokeWidth: 0,
                      })
                    } else {
                      component.log('selected')
                      this.attr({
                        selected: 'true',
                        stroke: 'rgba(95, 207, 198, 0.75)',
                        strokeWidth: 3,
                      })
                    }
                  })
                  .mouseover(function () {
                    this.attr({
                      stroke: 'red',
                      strokeWidth: 3,
                    })
                  })
                  .mouseout(function () {
                    if (this.attr('selected') === 'true') {
                      this.attr({
                        stroke: 'rgba(95, 207, 198, 0.75)',
                        strokeWidth: 3,
                      })
                    } else {
                      this.attr({
                        selected: 'false',
                        stroke: null,
                        strokeWidth: 0,
                      })
                    }
                  })
              })
    })
    */


    //const container = d3
      //.select('#canvas')
      //.append('svg')
      //.attr('height', 500)
      //.attr('width', 500)

    //const img = container.append('svg:image')
      //.attr('x', 0)
      //.attr('y', 0)
      //.attr('width', 400)
      //.attr('height', 400)
      //.attr('xlink:href', 'http://localhost:3333/open.svg')

    //const snap = Snap(img)


    //const circle = container
      //.append('circle')
      //.attr('cx', 30)
      //.attr('cy', 30)
      //.attr('r', 20)
      //.on('click', function (d, i) {
        //const elm = d3.select(this)
        //if (elm.attr('selected') === 'true') {
          //elm.attr('selected', 'false')
          //elm.attr('fill', 'black')
        //} else {
          //elm.attr('selected', 'true')
          //elm.attr('fill', 'blue')
        //}
      //})
      //.on('mouseover', function (d, i) {
        //const elm = d3.select(this)
        //elm.attr('fill', 'red')
      //})
      //.on('mouseout', function (d, i) {
        //const elm = d3.select(this)
        //if (elm.attr('selected') === 'true') {
          //elm.attr('fill', 'blue')
        //} else {
          //elm.attr('fill', 'black')
        //}
      //})


    //const canvas = this.refs.canvas
    //const ctx = canvas.getContext('2d')
    //ctx.fillStyle = '#ff9900'
    //ctx.fillRect(0, 0, 100, 100)
    ////const sqaure = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    ////square.onclick = () => console.log('clicked')
    ////square.setAttribute('style', 'border: 1px solid black');
    ////square.setAttribute('width', '600');
    ////square.setAttribute('height', '250')
    ////canvas.appendChild(square)
    //const img = new Image()
    //img.onload = () => {
      //console.log('image', img)
      //ctx.drawImage(img, 0, 0)
      ////img.onclick = () => console.log('click')
      //console.log('image', img)
    //}
    //img.onmouseover = () => console.log('mouse over')
    //img.src = 'http://localhost:3333/cat.svg'
    //d3.selectAll('h5').style('color', 'red')
    //img.on('mouseover', () => {
      //console.log('asdfadsf')
    //})
