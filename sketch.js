let width, height;

const component = new Component(200, 200, 300, 200);
const component2 = new Component(650, 550);

const components = [component, component2];

function registerComponents() {
  components.forEach((c) => state.register(c));
  state.register(component.addInput());
  state.register(component.addOutput());
  state.register(component2.addInput());
}

function setup() {
  // RENDERING
  width = 1000;
  height = 800;
  colorMode(HSB);
  noStroke();

  for (let element of document.getElementsByClassName("p5Canvas")) {
    element.addEventListener("contextmenu", (e) => e.preventDefault());
  }

  // LOGIC
  registerComponents(); // Make the top-level components available for custom logic

  // CREATE CANVAS
  createCanvas(width + 1, height + 1);
}

function renderComponents() {
  components.forEach((c) => c.render()); // Will also render connectors
}

function applyCursor() {
  if (state.objects.some((c) => c.mouseIsOver(true))) {
    cursor(HAND);
  } else {
    cursor(ARROW);
  }
}

// WIRE LAB
let isDragging = false;
let wire = undefined;
const wires = [];
function mouseDragged() {
  if (wire) {
    wire.x2 = mouseX;
    wire.y2 = mouseY;
  }
}

function draw() {
  background(25);
  renderComponents();
  applyCursor();

  // WIRE LAB
  if (wire) wire.render();
  wires.forEach((wire) => wire.render());
}

function mousePressed() {
  let interactedWithComponent = false;
  state.objects.forEach((c) => {
    if (c.mouseIsOver() && c.isClickable) {
      c.onClick(mouseButton);
      interactedWithComponent = true;
    }
  });

  //WIRE LAB
  if (!interactedWithComponent) wire = new Line(mouseX, mouseY, mouseX, mouseY);
}

//WIRE LAB
function mouseReleased() {
  if (wire) {
    const clone = new Line(wire.x1, wire.y1, wire.x2, wire.y2);
    wires.push(clone);
    wire = undefined;
  }
}
