let width, height;

const components = [];

function registerComponents() {
  components.forEach((c) => state.register(c));
  state.register(component.addInput());
  state.register(component.addOutput());
}

function createGate(gateDef, x, y) {
  const gate = new Component(x, y, 200, 100, gateDef);
  state.register(gate);
  components.push(gate);

  for (let i = 0; i < gateDef.inputs; i++) {
    state.register(gate.addInput());
  }
  for (let i = 0; i < gateDef.outputs; i++) {
    state.register(gate.addOutput());
  }
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

  // SETUP GATES
  createGate(Gates.And, 100, 100);
  createGate(Gates.Nand, 550, 100);
  createGate(Gates.Or, 100, 250);
  createGate(Gates.Nor, 550, 250);
  createGate(Gates.Xor, 100, 400);
  createGate(Gates.Xnor, 550, 400);
  createGate(Gates.Not, 100, 550);

  // CREATE CANVAS
  createCanvas(width + 1, height + 1);
}

function renderComponents() {
  components.forEach((c) => c.render()); // Will also render connectors
}

function doComponentLogic() {
  components.forEach((c) => c.logic());
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
  doComponentLogic();
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
