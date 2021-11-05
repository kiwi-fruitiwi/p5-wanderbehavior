const WANDER_DISTANCE = 100
const WANDER_RADIUS = 50
const DEBUG = true

// noinspection JSNonASCIINames
class Vehicle {
    constructor(x, y) {
        this.pos = new p5.Vector(x, y)
        this.vel = new p5.Vector(0.1, -0.05)
        this.acc = new p5.Vector()

        this.r = 14
        this.maxForce = 0.1

        // be careful of the limit! it doesn't care what direction is limited
        this.maxSpeed = 3
        this.angle = PI/2

        // stores our path so far
        this.currentPath = []
        this.paths = [this.currentPath]

        this.hitEdge = false
        this.sprite = loadImage("data/spaceship-48x48.png")
    }

    // TODO add more arrows
    wander() {
        let wanderPoint = this.vel.copy()

        // we set the magnitude before we add the position!
        wanderPoint.setMag(WANDER_DISTANCE)
        wanderPoint.add(this.pos)

        strokeWeight(1)
        stroke(0, 0, 100, 40)
        line(this.pos.x, this.pos.y, wanderPoint.x, wanderPoint.y)

        // area of wanderPoint circle
        noFill()
        stroke(0, 0, 100, 40)
        circle(wanderPoint.x, wanderPoint.y, WANDER_RADIUS*2)

        // point at center of wander circle
        stroke(200, 100, 100) // blue
        strokeWeight(3)
        point(wanderPoint.x, wanderPoint.y)

        // have our wanderPoint be somewhere on the circle
        let totalAngle = this.vel.heading() + this.angle
        let x = WANDER_RADIUS*cos(totalAngle)
        let y = WANDER_RADIUS*sin(totalAngle)

        // line between blue point (center of wander circle) and green point
        // point along wander circumference
        strokeWeight(1)
        stroke(0, 0, 100, 40)
        line(wanderPoint.x, wanderPoint.y, wanderPoint.x+x, wanderPoint.y+y)

        wanderPoint.add(new p5.Vector(x, y))

        strokeWeight(3)
        stroke(90, 100, 100) // green
        point(wanderPoint.x, wanderPoint.y)

        // another line from our center to the wanderPoint, now offset by angle
        strokeWeight(1)
        stroke(0, 0, 100, 40)
        // line(this.pos.x, this.pos.y, wanderPoint.x, wanderPoint.y)
        this.arrowLine(this.pos, wanderPoint)

        // a circle showing the range
        circle(wanderPoint.x, wanderPoint.y, WANDER_RADIUS)

        // position vector from our center to the wanderPoint
        let steeringForce = wanderPoint.sub(this.pos)
        steeringForce.setMag(this.maxForce)
        this.applyForce(steeringForce)

        this.angle += random(0, 0.02)
    }

    arrowLine(pos, target) {
        push()
        translate(pos.x, pos.y)
        let dir = p5.Vector.sub(target, pos)
        rotate(dir.heading())

        strokeWeight(1)
        stroke(0, 0, 100, 40)
        let r = dir.mag()
        line(0, 0, r, 0); // main acceleration vector
        line(r, 0, r - 3, -3); // bottom arrow half
        line(r, 0, r - 3, 3); // top arrow half

        pop()
    }


    renderSpaceship() {
        imageMode(CENTER)
        push()
        translate(this.pos.x, this.pos.y)
        rotate(this.vel.heading() + PI/2)
        image(this.sprite, 0, 0)
        pop()
    }


    // shows the 9S hacking bot
    render9S() {
        push()
        translate(this.pos.x, this.pos.y)
        rotate(this.vel.heading())

        let T = 0.4 // how far away is the tip away from the origin?
        let C = 0.2 // what is the radius of the inner circle?
        let B = 0.3 // how far away is the butt away from the origin?
        let r = this.r
        let a = 100 // alpha

        fill(0, 0, 100, a)
        stroke(0, 0, 0, a)
        strokeWeight(1)
        beginShape()
        vertex(r, 0) // front tip
        vertex(0, r * T) // top
        vertex(-r * T, 0)  // butt
        vertex(0, -r * T)  // bottom
        vertex(r, 0)  // front tip
        endShape()

        fill(0, 0, 0, a)
        circle(0, 0, r * C)
        stroke(0, 0, 0, a)
        strokeWeight(1)
        line(0, 0, -r * T, 0) // line to the butt

        let x = (r * T) / (self.sqrt(3) + T)
        line(0, 0, x, self.sqrt(3) * x) // line to the top 120 degrees
        line(0, 0, x, -self.sqrt(3) * x) // line to the bottom 120 degrees

        // two little squares in the back
        rectMode(CENTER)
        fill(0, 0, 100, a)
        strokeWeight(1)
        square(r * -B, r * T, r * 0.2)
        square(r * -B, -r * T, r * 0.2)

        pop()
    }

    renderPath() {

        stroke(0, 0, 100, 10)
        for (let p of this.paths) {
            beginShape()
            for (let v of p)
                vertex(v.x, v.y)
            endShape()
        }
    }

    update() {
        this.acc.limit(this.maxForce)
        this.vel.add(this.acc)
        this.vel.limit(this.maxSpeed)
        this.pos.add(this.vel)
        this.acc.mult(0)

        this.currentPath.push(this.pos.copy())
    }

    applyForce(force) { /* force is a p5.Vector */
        // F=ma, so a=F/m but since we assume m=1 for now, F=a
        this.acc.add(force)
    }

    edges() { // TODO take r into account, probably
        let hitEdge = false

        if (this.pos.x > width) { // right edge
            this.pos.x = 0
            hitEdge = true
        } else if (this.pos.x < 0) { // left edge
            this.pos.x = width
            hitEdge = true
        } else if (this.pos.y < 0) { // top edge
            this.pos.y = height
            hitEdge = true
        } else if (this.pos.y > height) { // bottom edge
            this.pos.y = 0
            hitEdge = true
        }

        if (hitEdge) {
            this.currentPath = []
            this.paths.push(this.currentPath)
        }
    }



    /*
    in edges(), push currentPath whenever we hit an edge
    use hitEdge boolean
    in constructor, currentPath = [], this.paths = [this.currentPath]
        in update(), this.currentPath.push(this.pos.copy())
    in show(), beginShape, iterate through all paths
     */
}