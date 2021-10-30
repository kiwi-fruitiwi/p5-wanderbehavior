/*
@author Kiwi
@date 2021-10-30

coding plan
    template
    basic particle code: render, update, applyForce, edges
        note this is the pass-through version of edges
        🛠
    wander()
        set wanderPoint with this.vel.copy(), setMag(DISTANCE)
        don't forget to add this.pos!
        set wanderRadius ➜ draw and test 🔧
        limit vel and acc, maxSpeed=2, maxForce=0.1


 */

let font
vehicles = []


function preload() {
    font = loadFont('fonts/Meiryo-01.ttf')
}


function setup() {
    createCanvas(640, 360)
    colorMode(HSB, 360, 100, 100, 100)

    vehicles.push(new Vehicle(width/2, height/2))
    console.log("setup complete! 🐳")
}


function draw() {
    background(234, 34, 24)

    vehicles.forEach(v => {
        // right now we don't need to worry about the order
        v.update()
        v.applyForce(gravityForce(0.1))
        v.render()
        v.edges()
        v.wander()
    })
}


function gravityForce(strength) {
    return new p5.Vector(0, strength)
}


class Vehicle {
    constructor(x, y) {
        this.pos = new p5.Vector(x, y)
        this.vel = new p5.Vector(1, 0)
        this.acc = new p5.Vector()

        this.maxForce = 0.1

        // be careful of the limit! it doesn't care what direction is limited
        this.maxSpeed = 10
    }

    wander() {

    }

    render() {
        // TODO: add 9S hacking bot!
        stroke(0, 0, 100)
        fill(0, 0, 100, 50)
        circle(this.pos.x, this.pos.y, 5*5)
    }

    update() {
        this.acc.limit(this.maxForce)
        this.vel.add(this.acc)
        this.vel.limit(this.maxSpeed)
        this.pos.add(this.vel)
        this.acc.mult(0)
    }

    applyForce(force) { /* force is a p5.Vector */
        // F=ma, so a=F/m but since we assume m=1 for now, F=a
        this.acc.add(force)
    }

    edges() {
        if (this.pos.x > width) {
            // right edge
            this.pos.x -= width
        } else if (this.pos.y > height) {
            // bottom edge
            this.pos.y -= height
        }
    }
}