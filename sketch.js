
let width, height;

const component = new Component(200, 200, 100, 300);
const component2 = new Component(350, 350);

const components = [component, component2];
const connectors = [];

function registerComponents() {
    components.forEach(c => state.register(c));

    state.register(component.addInput());
}

function setup() {
    colorMode(HSB);
    width = 1000;
    height = 800;

    registerComponents(); // Make the top-level components available for custom logic

    createCanvas(width + 1, height + 1);
    noStroke();

    for (let element of document.getElementsByClassName("p5Canvas")) {
        element.addEventListener("contextmenu", (e) => e.preventDefault());
    }
}

function draw() {
    background(25);
    components.forEach(c => c.render()); // Will also render connectors

    //Apply current cursor
    if (state.objects.some(c => c.mouseIsOver(true))) {
        cursor(HAND);
    }
    else {
        cursor(ARROW);
    }
}


function mousePressed() {
    state.objects.forEach(c => {
        if (c.mouseIsOver() && c.isClickable) { c.onClick(mouseButton) }
    });
}