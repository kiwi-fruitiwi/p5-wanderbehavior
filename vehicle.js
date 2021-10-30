const WANDER_DISTANCE = 100
const WANDER_RADIUS = 50
const DEBUG = true

// noinspection JSNonASCIINames
class Vehicle {
    constructor(x, y) {
        this.pos = new p5.Vector(x, y)
        this.vel = p5.Vector.random2D().mult(0.1)
        this.acc = new p5.Vector()

        this.r = 24
        this.maxForce = 0.1

        // be careful of the limit! it doesn't care what direction is limited
        this.maxSpeed = 10

        this.wanderθ = PI/2
    }

    wander() {

    }

    render() {
        push()
        translate(this.pos.x, this.pos.y)
        rotate(this.vel.heading())

        let T = 0.4 // how far away is the tip away from the origin?
        let C = 0.2 // what is the radius of the inner circle?
        let B = 0.3 // how far away is the butt away from the origin?
        let r = this.r

        fill(0, 0, 100, 75)
        stroke(0, 0, 0, 50)
        strokeWeight(1)
        beginShape()
        vertex(r, 0) // front tip
        vertex(0, r * T) // top
        vertex(-r * T, 0)  // butt
        vertex(0, -r * T)  // bottom
        vertex(r, 0)  // front tip
        endShape()

        fill(0, 0, 0, 100)
        circle(0, 0, r * C)
        stroke(0, 0, 0, 100)
        strokeWeight(1)
        line(0, 0, -r * T, 0) // line to the butt

        let x = (r * T) / (self.sqrt(3) + T)
        line(0, 0, x, self.sqrt(3) * x) // line to the top 120 degrees
        line(0, 0, x, -self.sqrt(3) * x) // line to the bottom 120 degrees

        // two little squares in the back
        rectMode(CENTER)
        fill(0, 0, 100, 75)
        strokeWeight(1)
        square(r * -B, r * T, r * 0.2)
        square(r * -B, -r * T, r * 0.2)

        pop()
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