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
            don't forget to add this.pos! 🐞 setMag after add()
            draw line from vehicle center to wanderPoint, plus circle around it
        add angle to wanderPoint
            set wanderRadius ➜ draw and test 🔧


        limit vel and acc, maxSpeed=2, maxForce=0.1

        arrow method to replace line


		θ determines our wanderPoint in polar coordinates. test with π/2 drawn
		make sure wanderPoint is with respect to this.vel.heading()
		steering force is wanderPoint - this.pos
		limit steering force magnitude to maxForce

		wanderθ! θ = wanderθ + this.pos
		maxSpeed = 2, maxForce 0.1
		displacementRange for wanderθ

		draw path
			series of paths. all paths + currentPath
			in edges(), push currentPath whenever we hit an edge
				use hitEdge boolean
			in constructor, currentPath = [], this.paths = [this.currentPath]
			in update(), this.currentPath.push(this.pos.copy())
			in show(), beginShape, iterate through all paths

		sliders to control size of big and small circles

		refactor into vector displacement
			keep track of vector instead of wanderθ
			wanderPoint vector.

		3D
 */

let font
vehicles = []


function preload() {
    font = loadFont('fonts/Meiryo-01.ttf')
}


function setup() {
    createCanvas(640, 360)
    colorMode(HSB, 360, 100, 100, 100)

    vehicles.push(new Vehicle(50, 300))
    console.log("setup complete! 🐳")
}


function draw() {
    background(234, 34, 24)

    vehicles.forEach(v => {
        // right now we don't need to worry about the order
        v.render()
        v.update()
        // v.applyForce(gravityForce(0.1))
        v.wander()
        v.renderPath()
        v.edges()
    })
}


function gravityForce(strength) {
    return new p5.Vector(0, strength)
}

function mousePressed() {
    noLoop()
}