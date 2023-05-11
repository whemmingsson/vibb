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

    // Will represent the anchor that is currently being dragged
    this.draggingAnchor = null;
  }

  _applyStroke() {
    strokeWeight(Globals.WireWeight);
    if (this.mouseIsOver()) {
      ColorScheme.White.applyStroke();
      return;
    }

    this._getSignalColor().applyStroke();
    if (this.on) {
      strokeWeight(Globals.WireWeight + 2);
    }
  }

  _createTemporarySegments() {
    let segments = [];
    segments.push({ x1: this.from.x, y1: this.from.y, x2: this.anchors[0].x, y2: this.anchors[0].y });
    for (let i = 0; i < this.anchors.length - 1; i++) {
      segments.push({ x1: this.anchors[i].x, y1: this.anchors[i].y, x2: this.anchors[i + 1].x, y2: this.anchors[i + 1].y });
    }
    segments.push({ x1: this.anchors[this.anchors.length - 1].x, y1: this.anchors[this.anchors.length - 1].y, x2: this.to.x, y2: this.to.y });
    return segments;
  }

  _mouseIsOverSegment(segment) {
    return isPointOnLine({ x: mouseX, y: mouseY }, { x: segment.x1, y: segment.y1 }, { x: segment.x2, y: segment.y2 });
  }

  _mouseIsOverAnchor(anchor) {
    return dist(mouseX, mouseY, anchor.x, anchor.y) < Globals.AnchorDiameter / 2;
  }

  mouseIsOver() {
    // Default scenario
    if (this.anchors.length === 0) {
      if (this.from && this.to) {
        return isPointOnLine({ x: mouseX, y: mouseY }, { x: this.from.x, y: this.from.y }, { x: this.to.x, y: this.to.y });
      }
      return false;
    }

    // Now we need to check indvidual line segments.
    // NOTE: This is required for the cursor / moving anchor functionality
    let segments = this._createTemporarySegments();
    for (let i = 0; i < segments.length; i++) {
      if (this._mouseIsOverSegment(segments[i])) return true;
    }

    return false;
  }

  _applyOnOffStrokeColor() {
    if (this.on) ColorScheme.SignalOn.applyStroke();
    else ColorScheme.SignalOff.applyStroke();
  }

  _renderAnchorPoint(x, y, color) {
    if (color) {
      color.applyFill();
      color.applyStroke();
    }
    let diameter = Globals.AnchorDiameter;
    if (this._mouseIsOverAnchor({ x: x, y: y })) {
      diameter = 20;
      ColorScheme.White.applyFill().applyStroke();
    }
    strokeWeight(Globals.StrokeWeight);
    ellipse(x, y, diameter, diameter);
  }

  _renderLine(x1, y1, x2, y2, weight) {
    strokeWeight(weight);
    line(x1, y1, x2, y2);
  }

  _getSignalColor() {
    return this.on ? ColorScheme.SignalOn : ColorScheme.SignalOn;
  }

  _renderLineSegments() {
    let segments = this._createTemporarySegments();
    segments.forEach((s) => {
      if (this._mouseIsOverSegment(s)) {
        ColorScheme.White.applyStroke();
      } else {
        ColorScheme.White.applyStroke();
      }
      this._renderLine(s.x1, s.y1, s.x2, s.y2, this.on ? Globals.WireWeight + 2 : Globals.WireWeight);
    });
  }

  _renderAnchorPoints() {
    this.anchors.forEach((a) => this._renderAnchorPoint(a.x, a.y, this._getSignalColor()));
  }

  _getMouseOverAnchor() {
    return this.anchors.find((a) => this._mouseIsOverAnchor(a));
  }

  render() {
    if (this.anchors.length === 0) {
      this._applyStroke();
      line(this.from.x, this.from.y, this.to ? this.to.x : mouseX, this.to ? this.to.y : mouseY);
    } else {
      this._renderLineSegments();
      this._renderAnchorPoints();
    }

    if (this.mouseIsOver()) {
      noFill();
      ColorScheme.White.applyStroke();
      strokeWeight(Globals.StrokeWeight);
      ellipse(mouseX, mouseY, Globals.AnchorDiameter, Globals.AnchorDiameter);
    }
  }

  onClick(button) {
    if (button === RIGHT) {
      this.from.removeWire(this);
      this.to.removeWire(this);
      return;
    }

    // If the mouse is over an anchor, we don't want to create a new anchor
    if (this._getMouseOverAnchor()) {
      return;
    }

    // Only good for when there are no anchors
    if (this.anchors.length === 0) {
      this.anchors.push({ x: mouseX, y: mouseY, anchor: true });
      return;
    }

    // Find the line segment that the mouse is over
    const selectedLineSegment = this._createTemporarySegments().find((ls) => this._mouseIsOverSegment(ls));
    const tempAnchors = [{ x: this.from.x, y: this.from.y }, ...this.anchors, { x: this.to.x, y: this.to.y }];

    // Find where to insert the anchor in the list of anchors
    const previousAnchor = tempAnchors.find((a) => a.x === selectedLineSegment.x1 && a.y === selectedLineSegment.y1);
    const idx = tempAnchors.indexOf(previousAnchor);
    this.anchors.splice(idx, 0, { x: mouseX, y: mouseY });
  }

  /* These functions should ideally belong to a new Anchor class */

  onMousePressed() {
    const anchor = this.anchors.find((a) => this._mouseIsOverAnchor(a));
    if (!anchor) return;

    this.draggingAnchor = anchor;
  }

  onMouseDragged() {
    if (!this.draggingAnchor) return;

    this.draggingAnchor.x = mouseX;
    this.draggingAnchor.y = mouseY;
  }

  onMouseReleased() {
    this.draggingAnchor = null;
  }
}
