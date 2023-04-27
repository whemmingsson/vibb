class Wire extends ComponentBase {
  constructor(from, to) {
    super(true, true, false, false);

    if (from.type !== "output") throw Error("Wire needs to go from Output to Input (from was not output)");
    if (to && to.type !== "input") throw Error("Wire needs to go from Output to Input (to was not input)");

    this.from = from;
    this.to = to;
    this.on = false;

    // Will represent branches of this wire
    this.anchors = [];
  }

  _applyStroke() {
    if (this.mouseIsOver()) {
      stroke(0, 0, 100);
      return;
    }

    if (this.on) ColorScheme.SignalOn.applyStroke();
    else ColorScheme.SignalOff.applyStroke();
  }

  mouseIsOver() {
    if (this.from && this.to) {
      return isPointOnLine({ x: mouseX, y: mouseY }, { x: this.from.x, y: this.from.y }, { x: this.to.x, y: this.to.y });
    }
    return false;
  }

  render() {
    this._applyStroke();
    strokeWeight(5);
    line(this.from.x, this.from.y, this.to ? this.to.x : mouseX, this.to ? this.to.y : mouseY);

    if (this.mouseIsOver()) {
      noFill();
      ColorScheme.White.applyStroke();
      strokeWeight(2);
      ellipse(mouseX, mouseY, 10, 10);
    }
  }

  onClick(button) {
    if (button === RIGHT) {
      this.from.removeWire(this);
      this.to.removeWire(this);
    }
  }
}
