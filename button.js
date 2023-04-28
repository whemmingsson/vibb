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
  }

  _applyBorder() {
    strokeWeight(Globals.StrokeWeight);
    if (this.mouseIsOver()) {
      ColorScheme.White.applyStroke();
    } else {
      ColorScheme.Black.applyStroke();
    }
  }

  _applyFill() {
    if (this.on) {
      ColorScheme.SignalOn.applyFill();
    } else {
      ColorScheme.SignalOff.applyFill();
    }
  }

  _renderWires() {
    const wires = [...this.outWires]; // Only render on the "out" side to prevent double rendering
    wires.forEach((w) => w.render());
  }

  updatePosition(x, y) {
    this.x = x;
    this.y = y;
  }

  mouseIsOver() {
    const isWithinCircle = () => {
      return dist(mouseX, mouseY, this.x, this.y) < this.w / 2;
    };
    return isWithinCircle();
  }

  render() {
    this._renderWires();
    this._applyBorder();
    this._applyFill();

    ellipse(this.x, this.y, this.w, this.h);
  }

  delete() {
    state.unregister(this);
  }

  onClick(mouseButton) {
    if (mouseButton === RIGHT) {
      this.delete();
    }
  }
}
