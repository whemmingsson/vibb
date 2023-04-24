let width, height;

// Component array for rendering
const components = [];

// Wire construction
let wire = undefined; // Wire used for rendering during construction

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

  // CREATE CANVAS
  createCanvas(width + 1, height + 1);

  // DISABLE RIGHT CLICK CONTEXT MENU
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
}

function renderComponents() {
  components.forEach((c) => c.render()); // Will also render connectors
}

function doComponentLogic() {
  components.forEach((c) => c.logic());
}

function applyCursor() {
  if (state.objects.some((c) => c.mouseIsOver && c.mouseIsOver(true))) {
    cursor(HAND);
  } else {
    cursor(ARROW);
  }
}

function draw() {
  background(25);
  doComponentLogic();
  renderComponents();
  applyCursor();

  if (wire) wire.render();
}

function mousePressed() {
  // Cancel creating wire
  if (mouseButton === RIGHT && wire) {
    wire = undefined;
    return;
  }

  // Handle click logic
  for (let i = 0; i < state.objects.length; i++) {
    const c = state.objects[i];

    if (c.mouseIsOver && c.mouseIsOver() && c.isClickable) {
      if (c instanceof Connector && c.type === 'output' && mouseButton === LEFT) {
        wire = new Wire(c, null);
        break;
      }
      if (c instanceof Connector && c.type === 'input' && wire && mouseButton === LEFT) {
        const clone = new Wire(wire.from, c);
        state.register(clone);

        // Register the wires on the connectors
        wire.from.outWires.push(clone);
        c.inWires.push(clone);

        wire = undefined;
        break;
      }

      c.onClick(mouseButton);
    }
  }
}