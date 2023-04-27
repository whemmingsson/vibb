// Wire construction
let wire = undefined; // Wire used for rendering during construction

// Dragging functionality
let dragComponent = null;
let dragDeltaX, dragDeltaY;

/***********/
/** SETUP **/
/***********/

function createGate(gateDef, x, y) {
  const gate = new Gate(x, y, 180, 80, gateDef);
  state.register(gate);
}

function setupGates() {
  // SETUP GATES
  createGate(Gates.And, 100, 100);
  createGate(Gates.Nand, 550, 100);
  createGate(Gates.Or, 100, 250);
  createGate(Gates.Nor, 550, 250);
  createGate(Gates.Xor, 100, 400);
  createGate(Gates.Xnor, 550, 400);
  createGate(Gates.Not, 100, 550);
}

function setup() {
  // RENDERING
  colorMode(HSB);
  noStroke();

  // CREATE CANVAS
  createCanvas(1000, 800);

  // DISABLE RIGHT CLICK CONTEXT MENU
  for (let element of document.getElementsByClassName("p5Canvas")) {
    element.addEventListener("contextmenu", (e) => e.preventDefault());
  }

  //createGate(Gates.And, 100, 100);
  setupGates();
}

/***************/
/** RENDERING **/
/***************/

function renderComponents() {
  state.gates.forEach((c) => c.render()); // Will also render pins
}

function doComponentLogic() {
  state.gates.forEach((c) => c.logic());
}

function applyCursor() {
  if (state.all().some((c) => c.mouseIsOver && c.mouseIsOver(true))) {
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

/******************/
/** MOUSE EVENTS **/
/******************/

function mouseDragged() {
  if (dragComponent) {
    dragComponent.updatePosition(mouseX - dragDeltaX, mouseY - dragDeltaY);
  }
}

function mouseReleased() {
  if (dragComponent) {
    dragComponent = null;
  }
}

function mousePressed() {
  // Cancel creating wire
  if (mouseButton === RIGHT && wire) {
    wire = undefined;
    return;
  }

  // Handle click logic
  for (let i = 0; i < state.all().length; i++) {
    const c = state.all()[i];

    // Begin-dragging
    if (c.mouseIsOver && c.mouseIsOver() && c instanceof Gate && mouseButton === LEFT) {
      dragComponent = c;
      dragDeltaX = Math.abs(mouseX - dragComponent.x);
      dragDeltaY = Math.abs(mouseY - dragComponent.y);
      break;
    }

    // Handle wire creation
    if (c.mouseIsOver && c.mouseIsOver() && c.isClickable) {
      if (c instanceof Pin && c.type === "output" && mouseButton === LEFT) {
        wire = new Wire(c, null);
        wire.on = c.on;
        break;
      }
      if (c instanceof Pin && c.type === "input" && wire && mouseButton === LEFT) {
        const clone = new Wire(wire.from, c);
        state.register(clone);

        // Register the wires on the pins
        wire.from.outWires.push(clone);
        c.inWires.push(clone);

        wire = undefined;
        break;
      }

      c.onClick(mouseButton);
    }
  }
}

/*********************/
/** KEYBOARD EVENTS **/
/*********************/

function keyTyped() {
  for (let i = 0; i < state.all().length; i++) {
    const c = state.all()[i];
    if (c.mouseIsOver && c.mouseIsOver() && c.onKeyTyped && key != "d") {
      c.onKeyTyped(key);
    } else if (c.mouseIsOver && c.mouseIsOver() && c.onKeyTyped && key === "d") {
      // Delete this
      if (confirm("Do you wanna delete this gate?")) {
        c.delete();
        state.unregister(c);
      }
    }
  }
}
