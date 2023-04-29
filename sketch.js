// Wire construction
let wire = undefined; // Wire used for rendering during construction

// Dragging functionality
let dragComponent = null;
let dragDeltaX, dragDeltaY;

let inputArea;
let outputArea;

/***********/
/** SETUP **/
/***********/

function createGate(gateDef, x, y) {
  const gate = new Gate(x, y, 180, 80, gateDef);
  state.register(gate);
  return gate;
}

function setupGates() {
  // SETUP GATES
  createGate(Gates.And, 180, 100);
  createGate(Gates.Nand, 550, 100);
  createGate(Gates.Or, 180, 250);
  createGate(Gates.Nor, 550, 250);
  createGate(Gates.Xor, 180, 400);
  createGate(Gates.Xnor, 550, 400);
  createGate(Gates.Not, 180, 550);
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

  // Setup click areas
  inputArea = new ClickArea(0, 0, Globals.ButtonDiameter, height);
  state.register(inputArea);

  setupGates();
}

/****************/
/** GATE LOGIC **/
/****************/

function doComponentLogic() {
  state.gates.forEach((c) => c.logic());
}

/***************/
/** RENDERING **/
/***************/

function renderGates() {
  state.gates.forEach((c) => c.render());
}

function renderButtons() {
  state.buttons.forEach((c) => c.render());
}

function applyCursor() {
  if (state.all().some((c) => c.mouseIsOver && c.mouseIsOver(true))) {
    cursor(HAND);
  } else {
    cursor(ARROW);
  }
}

/*************************/
/** BUTTON RENDER LOGIC **/
/*************************/

// Fix the buttons as "pins" on the left of the screen for now
function positionAndScaleButtons() {
  const h = height / (state.buttons.length + 1);

  state.buttons.forEach((pin, idx) => {
    const y = h * (idx + 1);
    pin.x = 0;
    pin.y = y;
  });
}

function draw() {
  background(25);

  // Click areas
  inputArea.render();

  doComponentLogic();
  renderButtons();
  renderGates();
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
    return;
  }

  let handledReleaseOnObject = false;

  const pressableObjects = state.all().filter(o => o.mouseIsOver && o.mouseIsOver());
  for (let i = 0; i < pressableObjects.length; i++) {
    const c = pressableObjects[i];

    // Create wire
    if (c instanceof Pin && c.type === "input" && wire && mouseButton === LEFT) {
      const clone = new Wire(wire.from, c);
      state.register(clone);

      // Register the wires on the pins
      wire.from.outWires.push(clone);
      c.inWires.push(clone);

      wire = null;
      handledReleaseOnObject = true;
      break;
    }

    // Toggle button signal
    if (c instanceof Button && mouseButton === LEFT) {
      c.toggle();
    }
  }

  // Stop creating wire
  if (!handledReleaseOnObject) {
    wire = null;
  }
}

function mousePressed() {
  // Handle click logic
  const pressableObjects = state.all().filter(o => o.mouseIsOver && o.mouseIsOver());
  for (let i = 0; i < pressableObjects.length; i++) {
    const c = pressableObjects[i];

    // Begin-dragging
    // To include dragability for buttons: || c instanceof Button
    if (c instanceof Gate && mouseButton === LEFT) {
      dragComponent = c;
      dragDeltaX = Math.abs(mouseX - dragComponent.x);
      dragDeltaY = Math.abs(mouseY - dragComponent.y);
      break;
    }

    // Handle wire creation
    if (((c instanceof Pin && c.type === "output") || c instanceof Button) && mouseButton === LEFT) {
      wire = new Wire(c, null);
      wire.on = c.on;
      break;
    }

    // Handle clicking on the input area
    if (c instanceof ClickArea && mouseButton === LEFT) {
      state.register(new Button(mouseX, mouseY, Globals.ButtonDiameter, Globals.ButtonDiameter));
      positionAndScaleButtons();
      break;
    }

    // Default case
    c.onClick(mouseButton);
    positionAndScaleButtons(); // Hack. This should not be here really.
  }
}

/*********************/
/** KEYBOARD EVENTS **/
/*********************/

function keyTyped() {
  const interactiveObjects = state.all().filter(o => o.mouseIsOver && o.mouseIsOver() && o.onKeyTyped);
  for (let i = 0; i < interactiveObjects.length; i++) {
    const c = interactiveObjects[i];
    if (key != "d") {
      c.onKeyTyped(key);
    } else if (confirm("Do you wanna delete this gate?")) {
      c.delete();
      state.unregister(c);
    }
  }
}
