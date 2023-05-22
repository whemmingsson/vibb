class Breadboard {
  constructor() {
    this.inputArea = null;
    this.outputArea = null;

    // Interactive
    this.dragComponent = null;
    this.wire = null;
    this.dragDeltaX = 0;
    this.dragDeltaY = 0;
  }

  _createGate(gateDef, x, y) {
    return state.register(new Gate(x, y, 140, 60, gateDef));
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

    // Lab and dev gates
    const g1 = create(Gates.Not, 300, 200);
    const g2 = create(Gates.Not, 600, 200);
    const wire = new Wire(g1.outputs[0], g2.inputs[0]);
    state.register(wire);
    g1.outputs[0].outWires.push(wire);
    g2.inputs[0].inWires.push(wire);
  }

  _doGateLogic() {
    state.objects.gates.forEach((c) => c.logic());
  }

  _renderGates() {
    state.objects.gates.forEach((c) => c.render());
  }

  _renderButtons() {
    state.objects.buttons.forEach((c) => c.render());
  }

  _renderWires() {
    state.objects.wires.forEach((w) => w.render());
  }

  _renderAreas() {
    this.inputArea.render();
    this.outputArea.render();
  }

  _renderGrid() {
    ColorScheme.GridLine.applyStroke();
    strokeWeight(Globals.GridLineWeight);
    for (let x = 0; x < width; x += Globals.GridCellSize) {
      line(x, 0, x, height);
    }
    for (let y = 0; y < height; y += Globals.GridCellSize) {
      line(0, y, width, y);
    }
  }

  _positionAndScaleButtons() {
    const h = height / (state.objects.buttons.length + 1);

    state.objects.buttons.forEach((btn, idx) => {
      btn.updatePosition(0, h * (idx + 1));
    });
  }

  _positionAndScaleOutputs() {
    const h = height / (state.outputs.length + 1);

    state.outputs.forEach((output, idx) => {
      output.updatePosition(0, h * (idx + 1));
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

    this.inputArea = new ClickArea(0, 0, Globals.ButtonDiameter, height, "input");
    state.register(this.inputArea);

    this.outputArea = new ClickArea(width - Globals.ButtonDiameter, 0, Globals.ButtonDiameter, height, "output");
    state.register(this.outputArea);

    this._setupGates();
  }

  onDraw() {
    ColorScheme.Background.applyBackground();

    this.inputArea.render();

    this._renderGrid();
    this._renderAreas();
    this._renderWires();

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
      if (c instanceof ClickArea && mouseButton === LEFT && c.type === "input") {
        state.register(new Button(mouseX, mouseY, Globals.ButtonDiameter, Globals.ButtonDiameter));
        this._positionAndScaleButtons();
        break;
      }

      // Handle clicking on the output area
      if (c instanceof ClickArea && mouseButton === LEFT && c.type === "output") {
        state.register(new Output(mouseX, mouseY, Globals.ButtonDiameter, Globals.ButtonDiameter));
        this._positionAndScaleOutputs();
        break;
      }

      // Default case
      c.onClick(mouseButton);
      this._positionAndScaleButtons();
      break; // Only handle one object per click
    }

    state.objects.wires.forEach((w) => w.onMousePressed());
  }

  onMouseDragged() {
    if (this.dragComponent) {
      this.dragComponent.updatePosition(mouseX - this.dragDeltaX, mouseY - this.dragDeltaY);
    }

    state.objects.wires.forEach((w) => w.onMouseDragged());
  }

  onMouseReleased() {
    if (this.dragComponent) {
      if (Globals.SnapToGrid) {
        const p = getSnapToGridPoint(this.dragComponent.x, this.dragComponent.y);
        this.dragComponent.updatePosition(p.x, p.y);
      }
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

    state.objects.wires.forEach((w) => w.onMouseReleased());
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
