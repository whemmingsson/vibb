class Pin extends ComponentBase {
  constructor(x, y, parentComponent, type) {
    super(true, true, false, false);
    this.x = x;
    this.y = y;
    this.parentComponent = parentComponent;
    this.type = type;
    this.on = false;

    this.inWires = [];
    this.outWires = [];
  }

  _applyBorder() {
    strokeWeight(Globals.StrokeWeight);
    if (this.mouseIsOver()) {
      GetScheme().White.applyStroke();
    } else {
      GetScheme().White.applyStroke();
    }
  }

  _applyFill() {
    if (this.on) GetScheme().SignalOn.applyFill();
    else GetScheme().Gate.applyFill();
  }

  removeWire(wire) {
    const inWireIdx = this.inWires.findIndex((w) => w.id === wire.id);
    if (inWireIdx >= 0) {
      this.inWires.splice(inWireIdx, 1);
      this.on = this.inWires.length === 0 ? false : this.inWires.some((w) => w.on);
    }
    const outWireIdx = this.outWires.findIndex((w) => w.id === wire.id);
    if (outWireIdx >= 0) {
      this.outWires.splice(outWireIdx, 1);
    }

    if (outWireIdx >= 0 || inWireIdx >= 0) {
      state.unregister(wire);
    }
  }

  _renderWires() {
    const wires = [...this.outWires]; // Only render on the "out" side to prevent double rendering
    wires.forEach((w) => w.render());
  }

  toggle(signal) {
    this.on = signal;
    this.outWires.forEach((wire) => (wire.on = signal));
  }

  applyInputSignal() {
    if (this.inWires.length === 0) return;

    if (this.inWires.some((wire) => wire.on)) {
      this.on = true;
    } else {
      this.on = false;
    }
  }

  render() {
    // NOTE: This has moved to global render function
    //this._renderWires();
    this._applyFill();
    this._applyBorder();
    if (this.type === "input") arc(this.x, this.y, this.w, this.h, PI / 2, PI / 2 + PI, PIE);
    else if (this.type === "output") arc(this.x, this.y, this.w, this.h, PI / 2 + PI, PI / 2 + PI + PI, PIE);
  }

  mouseIsOver() {
    const isWithinCircle = () => {
      return dist(mouseX, mouseY, this.x, this.y) < this.w / 2;
    };
    if (this.type === "input") return isWithinCircle() && mouseX < this.x;
    if (this.type === "output") return isWithinCircle() && mouseX > this.x;
  }

  onClick(mouseButton) {
    if (mouseButton === RIGHT) {
      if (this.type === "input") this.parentComponent.removeInput(this);
      else if (this.type === "output") this.parentComponent.removeOutput(this);
    } else if (mouseButton === LEFT && this.type === "input") {
      if (this.inWires.length > 0) {
        alert("You cannot activate this input - it has a wire going into it");
        return;
      }
      this.on = !this.on;
    }
  }

  delete() {
    [...this.outWires, ...this.inWires].forEach((w) => {
      w.from.removeWire(w);
      w.to.removeWire(w);
    });
  }

  reduce() {
    return {
      id: this.id,
      x: this.x,
      y: this.y,
      type: this.type
    };
  }
}
