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
    this.points = [];
  }

  _applyStroke() {
    strokeWeight(Globals.WireWeight);
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

  _renderAnchorPoint(x, y) {

    strokeWeight(2);
    ellipse(x, y, 10, 10);
  }

  _renderLineWithAnchors() {
    const points = [];
    points.push({ x: this.from.x, y: this.from.y });
    points.push(...this.anchors);
    points.push({ x: this.to.x, y: this.to.y });
    for (let i = 0; i < points.length - 1; i++) {
      this._applyStroke();
      strokeWeight(5);
      let p1 = points[i];
      let p2 = points[i + 1];
      line(p1.x, p1.y, p2.x, p2.y);
      if (p1.anchor) {
        ColorScheme.SignalOff.applyFill();
        ColorScheme.Black.applyStroke();
        strokeWeight(Globals.strokeWeight);
        this._renderAnchorPoint(p1.x, p1.y);
      }
    }
  }

  render() {
    this._applyStroke();
    strokeWeight(5);
    if (this.anchors.length === 0) {
      line(this.from.x, this.from.y, this.to ? this.to.x : mouseX, this.to ? this.to.y : mouseY);
    }
    else {
      this._renderLineWithAnchors();
    }

    if (this.mouseIsOver()) {
      noFill();
      ColorScheme.White.applyStroke();
      this._renderAnchorPoint(mouseX, mouseY);
    }
  }



  onClick(button) {
    if (button === RIGHT) {
      this.from.removeWire(this);
      this.to.removeWire(this);
    }
    this.anchors.push({ x: mouseX, y: mouseY, anchor: true })
  }
}
