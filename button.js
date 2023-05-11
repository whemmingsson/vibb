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
    this.label = "Lorem"; // Dummy label until we have a UI for this
  }

  _applyBorder() {
    strokeWeight(Globals.StrokeWeight);
    ColorScheme.White.applyStroke();
  }

  _applyFill() {
    if (this.on) {
      ColorScheme.SignalOn.applyFill();
    } else {
      ColorScheme.ClickArea.applyFill();
    }
  }

  _renderWires() {
    this.outWires.forEach((w) => w.render());
  }

  _renderLabel() {
    ColorScheme.White.applyFill();
    noStroke();
    textSize(24);
    textAlign(CENTER);
    text(this.label, this.x + this.w, this.y - this.h / 2);
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
