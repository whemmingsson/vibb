class Button extends ComponentBase {
  constructor(x, y, w, h) {
    super(true, true, true, true);
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;

    this.on = false;
    this.outWires = [];
    this.type = "output";
    this.label = state.register(new Label(this.x + this.w / 2 + 10, this.y - this.h / 2 - 10, "Lorem Ipsum"));
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
    const isWithinCircle = () => {
      return dist(mouseX, mouseY, this.x, this.y) < this.w / 2;
    };
    return isWithinCircle();
  }

  toggle() {
    this.on = !this.on;
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
}
