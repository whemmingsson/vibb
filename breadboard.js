class Breadboard {
  constructor() {
    this.inputArea = null;
    this.outputArea = null;

    // Interactive
    this.dragComponent = null;
    this.wire = null;
    this.dragDeltaX = 0;
    this.dragDeltaY = 0;

    colorMode(HSB);

    this.inputArea = new ClickArea(0, 0, Globals.ButtonDiameter, height, "input");
    state.register(this.inputArea);

    this.outputArea = new ClickArea(width - Globals.ButtonDiameter, 0, Globals.ButtonDiameter, height, "output");
    state.register(this.outputArea);

    this._setupGates();
  }

  _createGateTemplate(gateDef, x, y) {
    return state.register(new GateTemplate(x, y, 120, 50, gateDef));
  }

  _setupGates() {
    const create = this._createGateTemplate;
    create(Gates.Not, 80, 45);
    create(Gates.And, 260, 45);
    create(Gates.Or, 440, 45);
    create(Gates.Xor, 620, 45);

    create(Gates.Nand, 800, 45);
    create(Gates.Nor, 980, 45);
    create(Gates.Xnor, 1160, 45);

    // Lab and dev gates
    /*const g1 = create(Gates.Not, 300, 200);
    const g2 = create(Gates.Not, 600, 200);
    const wire = new Wire(g1.outputs[0], g2.inputs[0]);
    state.register(wire);
    g1.outputs[0].outWires.push(wire);
    g2.inputs[0].inWires.push(wire); */
  }

  _renderGrid() {
    GetScheme().GridLine.applyStroke();
    strokeWeight(Globals.GridLineWeight);
    for (let x = 0; x < width; x += Settings.GridCellSize) {
      line(x, 0, x, height);
    }
    for (let y = 0; y < height; y += Settings.GridCellSize) {
      line(0, y, width, y);
    }
  }

  _renderGateMenuHeader() {
    GetScheme().White.applyFill();
    noStroke();
    textSize(20);
    textAlign(LEFT, CENTER);
    text("Gates (ALT + left-click to clone)", 80, 20);
  }

  _positionAndScaleButtons() {
    const h = height / (state.objects.buttons.length + 1);

    state.objects.buttons.forEach((btn, idx) => {
      btn.updatePosition(0, h * (idx + 1));
    });
  }

  _positionAndScaleOutputs() {
    const h = height / (state.objects.outputs.length + 1);

    state.objects.outputs.forEach((output, idx) => {
      output.updatePosition(width, h * (idx + 1));
    });
  }

  _applyCursor() {
    if (state.all().some((c) => c.mouseIsOver && c.mouseIsOver(true))) {
      cursor(HAND);
    } else {
      cursor(ARROW);
    }
  }

  _handleGateDragging(object) {
    if (object instanceof Gate && mouseButton === LEFT && !(object instanceof GateTemplate) && !keyIsPressed) {
      this.dragComponent = object;
      this.dragDeltaX = Math.abs(mouseX - this.dragComponent.x);
      this.dragDeltaY = Math.abs(mouseY - this.dragComponent.y);
      return true;
    }
    return false;
  }

  _handleWireCreation(object) {
    if (((object instanceof Pin && object.type === "output" && !(object.parentComponent instanceof GateTemplate)) || object instanceof Button) && mouseButton === LEFT) {
      this.wire = new Wire(object, null, object.on);
      return true;
    }
    return false;
  }

  _handleInputAreaClick(object) {
    if (object instanceof ClickArea && object.type === "input" && mouseButton === LEFT) {
      state.register(new Button(mouseX, mouseY, Globals.ButtonDiameter, Globals.ButtonDiameter));
      this._positionAndScaleButtons();
      return true;
    }
    return false;
  }

  _handleOutputAreaClick(object) {
    if (object instanceof ClickArea && object.type === "output" && mouseButton === LEFT) {
      state.register(new Output(mouseX, mouseY, Globals.ButtonDiameter, Globals.ButtonDiameter));
      this._positionAndScaleOutputs();
      return true;
    }
    return false;
  }

  _handleClick(object) {
    object.onClick(mouseButton, key);
  }

  onDraw() {
    GetScheme().Background.applyBackground();

    [...state.objects.gates, ...state.objects.outputs].forEach((c) => c.logic());

    if (Settings.ShowGrid) this._renderGrid();

    this._renderGateMenuHeader();

    this.inputArea.render();
    this.outputArea.render();
    state.objects.wires.forEach((wire) => wire.render());
    state.objects.buttons.forEach((button) => button.render());
    state.objects.outputs.forEach((output) => output.render());
    state.objects.templates.forEach((template) => template.render());
    state.objects.gates.forEach((gate) => gate.render());

    this._applyCursor();

    if (this.wire) this.wire.render();
  }

  onMousePressed() {
    for (const object of state.all().filter((o) => o.mouseIsOver && o.mouseIsOver())) {
      if (this._handleGateDragging(object)) {
        return;
      } else if (this._handleWireCreation(object)) {
        return;
      } else if (this._handleInputAreaClick(object)) {
        return;
      } else if (this._handleOutputAreaClick(object)) {
        return;
      } else {
        this._handleClick(object);
        this._positionAndScaleButtons();
        break;
      }
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
    // TODO: This is a mess. Refactor.
    if (this.dragComponent) {
      if (Settings.SnapToGrid) {
        const p = MathUtils.getSnapToGridPoint(this.dragComponent.x, this.dragComponent.y, Settings.GridCellSize);
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
      if ((c instanceof Pin && c.type === "input" && !(c.parentComponent instanceof GateTemplate) || c instanceof Output) && this.wire && mouseButton === LEFT) {
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
      interactiveObjects[i].onKeyTyped(key);
    }
  }
}
