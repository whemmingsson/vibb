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
  }
}

function mousePressed() {
  // Cancel creating wire
  if (mouseButton === RIGHT && wire) {
    wire = undefined;
    return;
  }

  // Handle click logic
  let handledClickOnObject = false;
  for (let i = 0; i < state.all().length; i++) {
    const c = state.all()[i];

    // Begin-dragging
    // To include dragability for buttons: || c instanceof Button
    if (c.mouseIsOver && c.mouseIsOver() && c instanceof Gate && mouseButton === LEFT) {
      dragComponent = c;
      dragDeltaX = Math.abs(mouseX - dragComponent.x);
      dragDeltaY = Math.abs(mouseY - dragComponent.y);
      handledClickOnObject = true;
      break;
    }

    if (c.mouseIsOver && c.mouseIsOver() && c.isClickable) {
      // Handle wire creation

      // Handle pin-pin case
      if (c instanceof Pin && c.type === "output" && mouseButton === LEFT) {
        wire = new Wire(c, null);
        wire.on = c.on;
        handledClickOnObject = true;
        break;
      }
      if (c instanceof Pin && c.type === "input" && wire && mouseButton === LEFT) {
        const clone = new Wire(wire.from, c);
        state.register(clone);

        // Register the wires on the pins
        wire.from.outWires.push(clone);
        c.inWires.push(clone);

        wire = undefined;
        handledClickOnObject = true;
        break;
      }

      // TODO: This clashes with click logic - it means there is no way of turning the button on by clicking...

      // Handle button-pin case
      if (c instanceof Button && mouseButton === LEFT) {
        wire = new Wire(c, null);
        wire.on = c.on;
        handledClickOnObject = true;
        break;
      }

      // Handle button-pin case
      if (c instanceof Pin && wire && mouseButton === LEFT && c.type === "input") {
        const clone = new Wire(wire.from, c);
        state.register(clone);

        // Register the wires on the pins
        wire.from.outWires.push(clone);
        c.inWires.push(clone);

        wire = undefined;
        handledClickOnObject = true;
        break;
      }

      if (c instanceof ClickArea && mouseButton === LEFT) {
        console.log("Clicked on input area");
        const btn = new Button(mouseX, mouseY, Globals.ButtonDiameter, Globals.ButtonDiameter);
        state.register(btn);
        positionAndScaleButtons();
        break;
      }

      // Default case
      c.onClick(mouseButton);
      positionAndScaleButtons(); // Hack. This should not be here really.
      handledClickOnObject = true;
    }
  }

  // Click on something outside of any simulation objects
  if (!handledClickOnObject) {
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
