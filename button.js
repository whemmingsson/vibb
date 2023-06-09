class Button extends ComponentBase {
  constructor(x, y, w, h, labelText) {
    super(true, true, true, true);
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;

    this.on = false;
    this.outWires = [];
    this.type = "output";
    this.label = state.register(new Label(this.x + this.w / 2 + 10, this.y - this.h / 2 - 10, labelText ?? "<click to edit>"));
  }

  _applyBorder() {
    strokeWeight(Globals.StrokeWeight);
    GetScheme().White.applyStroke();
  }

  _applyFill() {
    if (this.on) {
      GetScheme().SignalOn.applyFill();
    } else {
      GetScheme().ClickArea.applyFill();
    }
  }

  _renderWires() {
    this.outWires.forEach((w) => w.render());
  }

  _renderLabel() {
    this.label.render();
  }

  updatePosition(x, y) {
    this.x = x;
    this.y = y;

    this.label.x = this.x + this.w / 2 + 10;
    this.label.y = this.y - this.h / 2 - 10;
  }

  mouseIsOver() {
    return MathUtils.pointIsWithinCircle({ x: mouseX, y: mouseY }, { x: this.x, y: this.y, w: this.w });
  }

  toggle(value) {
    if (value !== undefined) {
      this.on = value;
    }
    else {
      this.on = !this.on;
    }
    this.outWires.forEach((wire) => (wire.on = this.on));
  }

  render() {
    this._renderWires();
    this._applyBorder();
    this._applyFill();

    ellipse(this.x, this.y, this.w, this.h);
    this._renderLabel();
  }

  delete() {
    state.unregister(this);
    this.outWires.forEach((wire, outWireIdx) => {
      if (outWireIdx >= 0) {
        this.outWires.splice(outWireIdx, 1);
      }

      if (outWireIdx >= 0 || inWireIdx >= 0) {
        state.unregister(wire);
      }
    });
  }

  onClick(mouseButton) {
    if (mouseButton === RIGHT) {
      this.delete();
    }
  }

  removeWire(wire) {
    const outWireIdx = this.outWires.findIndex((w) => w.id === wire.id);
    if (outWireIdx >= 0) {
      this.outWires.splice(outWireIdx, 1);
    }
  }

  reduce() {
    return {
      id: this.id,
      x: this.x,
      y: this.y,
      w: this.w,
      h: this.h,
      type: this.type,
      label: this.label.text,
      outWires: this.outWires.map((w) => w.id),
    };
  }
}
