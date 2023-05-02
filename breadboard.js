class Breadboard {
  constructor() {
    this.inputArea = null;

    // Interactive
    this.dragComponent = null;
    this.wire = null;
    this.dragDeltaX = 0;
    this.dragDeltaY = 0;
  }

  _createGate(gateDef, x, y) {
    state.register(new Gate(x, y, 140, 60, gateDef));
  }

  _setupGates() {
    const create = this._createGate;
    create(Gates.Not, 80, 10);
    create(Gates.And, 260, 10);
    create(Gates.Or, 440, 10);
    create(Gates.Xor, 620, 10);

    create(Gates.Nand, 800, 10);
    create(Gates.Nor, 980, 10);
    create(Gates.Xnor, 1160, 10);
  }

  _doGateLogic() {
    state.gates.forEach((c) => c.logic());
  }

  _renderGates() {
    state.gates.forEach((c) => c.render());
  }

  _renderButtons() {
    state.buttons.forEach((c) => c.render());
  }

  _positionAndScaleButtons() {
    const h = height / (state.buttons.length + 1);

    state.buttons.forEach((pin, idx) => {
      pin.x = 0;
      pin.y = h * (idx + 1);
    });
  }

  _applyCursor() {
    if (state.all().some((c) => c.mouseIsOver && c.mouseIsOver(true))) {
      cursor(HAND);
    } else {
      cursor(ARROW);
    }
  }

  onSetup() {
    colorMode(HSB);

    this.inputArea = new ClickArea(0, 0, Globals.ButtonDiameter, height);
    state.register(this.inputArea);
    this._setupGates();
  }

  onDraw() {
    background(25);

    this.inputArea.render();

    this._doGateLogic();
    this._renderButtons();
    this._renderGates();
    this._applyCursor();

    if (this.wire) this.wire.render();
  }

  onMousePressed() {
    const pressableObjects = state.all().filter((o) => o.mouseIsOver && o.mouseIsOver());
    for (let i = 0; i < pressableObjects.length; i++) {
      const c = pressableObjects[i];

      // Begin-dragging
      // To include dragability for buttons: || c instanceof Button
      if (c instanceof Gate && mouseButton === LEFT) {
        this.dragComponent = c;
        this.dragDeltaX = Math.abs(mouseX - this.dragComponent.x);
        this.dragDeltaY = Math.abs(mouseY - this.dragComponent.y);
        break;
      }

      // Handle wire creation
      if (((c instanceof Pin && c.type === "output") || c instanceof Button) && mouseButton === LEFT) {
        this.wire = new Wire(c, null);
        this.wire.on = c.on;
        break;
      }

      // Handle clicking on the input area
      if (c instanceof ClickArea && mouseButton === LEFT) {
        state.register(new Button(mouseX, mouseY, Globals.ButtonDiameter, Globals.ButtonDiameter));
        this._positionAndScaleButtons();
        break;
      }

      // Default case
      c.onClick(mouseButton);
      this._positionAndScaleButtons();
    }
  }

  onMouseDragged() {
    if (this.dragComponent) {
      this.dragComponent.updatePosition(mouseX - this.dragDeltaX, mouseY - this.dragDeltaY);
    }
  }

  onMouseReleased() {
    if (this.dragComponent) {
      this.dragComponent = null;
      return;
    }

    let handledReleaseOnObject = false;

    const pressableObjects = state.all().filter((o) => o.mouseIsOver && o.mouseIsOver());
    for (let i = 0; i < pressableObjects.length; i++) {
      const c = pressableObjects[i];

      // Create wire
      if (c instanceof Pin && c.type === "input" && this.wire && mouseButton === LEFT) {
        const clone = new Wire(this.wire.from, c);
        state.register(clone);

        // Register the wires on the pins
        this.wire.from.outWires.push(clone);
        c.inWires.push(clone);

        this.wire = null;
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
      this.wire = null;
    }
  }

  onKeyTyped() {
    const interactiveObjects = state.all().filter((o) => o.mouseIsOver && o.mouseIsOver() && o.onKeyTyped);
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
}
