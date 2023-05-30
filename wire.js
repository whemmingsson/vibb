class Wire extends ComponentBase {
  constructor(from, to, signal) {
    super(true, true, false, false);

    if (from.type !== "output") throw Error("Wire needs to go from Output to Input (from was not output)");
    if (to && to.type !== "input") throw Error("Wire needs to go from Output to Input (to was not input)");

    this.from = from;
    this.to = to;

    if (signal === undefined) {
      this.on = false;
    }
    else {
      this.on = signal;
    }

    // Will represent branches of this wire
    this.anchors = [];
    this.segments = []

    // Will represent the anchor that is currently being dragged
    this.draggingAnchor = null;
  }

  _applyStroke() {
    strokeWeight(Globals.WireWeight);
    if (this.mouseIsOver()) {
      GetScheme().White.applyStroke();
    }
    else {
      this._getSignalColor().applyStroke();
    }

    if (this.on) {
      strokeWeight(Globals.WireWeight + 2);
    }
  }

  _createSegments() {
    let segments = [];
    if (this.anchors.length === 0) return segments;

    segments.push({ x1: this.from.x, y1: this.from.y, x2: this.anchors[0].x, y2: this.anchors[0].y });
    for (let i = 0; i < this.anchors.length - 1; i++) {
      segments.push({ x1: this.anchors[i].x, y1: this.anchors[i].y, x2: this.anchors[i + 1].x, y2: this.anchors[i + 1].y });
    }
    segments.push({ x1: this.anchors[this.anchors.length - 1].x, y1: this.anchors[this.anchors.length - 1].y, x2: this.to.x, y2: this.to.y });
    return segments;
  }

  _mouseIsOverSegment(segment) {
    return MathUtils.isPointOnLine({ x: mouseX, y: mouseY }, { x: segment.x1, y: segment.y1 }, { x: segment.x2, y: segment.y2 });
  }

  _mouseIsOverAnchor(anchor) {
    return MathUtils.pointIsWithinCircle({ x: mouseX, y: mouseY }, { x: anchor.x, y: anchor.y, w: Globals.AnchorDiameter });
  }

  _applyOnOffStrokeColor() {
    if (this.on) GetScheme().SignalOn.applyStroke();
    else GetScheme().SignalOff.applyStroke();
  }

  _renderAnchorPoint(x, y, color) {
    if (color) {
      color.applyFill();
      color.applyStroke();
    }

    let diameter = Globals.AnchorDiameter;
    if (this._mouseIsOverAnchor({ x: x, y: y })) {
      diameter = 20;
      GetScheme().White.applyFill().applyStroke();
    }

    strokeWeight(Globals.StrokeWeight);
    ellipse(x, y, diameter, diameter);
  }

  _renderLine(x1, y1, x2, y2, weight) {
    strokeWeight(weight);
    line(x1, y1, x2, y2);
  }

  _getSignalColor() {
    return this.on ? GetScheme().SignalOn : GetScheme().SignalOff;
  }

  _renderLineSegments() {
    this.segments.forEach((s) => {
      if (this._mouseIsOverSegment(s)) {
        GetScheme().White.applyStroke();
      } else {
        GetScheme().White.applyStroke();
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
      GetScheme().White.applyStroke();
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
      this.updateSegments();
      return;
    }

    // Find the line segment that the mouse is over
    const selectedLineSegment = this.segments.find((ls) => this._mouseIsOverSegment(ls));
    const tempAnchors = [{ x: this.from.x, y: this.from.y }, ...this.anchors, { x: this.to.x, y: this.to.y }];

    // Find where to insert the anchor in the list of anchors
    const previousAnchor = tempAnchors.find((a) => a.x === selectedLineSegment.x1 && a.y === selectedLineSegment.y1);
    const idx = tempAnchors.indexOf(previousAnchor);
    this.anchors.splice(idx, 0, { x: mouseX, y: mouseY });
  }

  mouseIsOver() {
    // Default scenario
    if (this.anchors.length === 0) {
      if (this.from && this.to) {
        return MathUtils.isPointOnLine({ x: mouseX, y: mouseY }, { x: this.from.x, y: this.from.y }, { x: this.to.x, y: this.to.y });
      }
      return false;
    }

    // Now we need to check indvidual line segments.
    // NOTE: This is required for the cursor / moving anchor functionality
    for (let i = 0; i < this.segments.length; i++) {
      if (this._mouseIsOverSegment(this.segments[i])) return true;
    }

    return false;
  }

  onMousePressed() {
    const anchor = this.anchors.find((a) => this._mouseIsOverAnchor(a));
    if (!anchor) return;

    this.draggingAnchor = anchor;
  }

  onMouseDragged() {
    if (!this.draggingAnchor) return;

    // This is to reduce the number of times we create segments
    const mousePosChanged = mouseX !== this.draggingAnchor.x || mouseY !== this.draggingAnchor.y;

    this.draggingAnchor.x = mouseX;
    this.draggingAnchor.y = mouseY;

    if (mousePosChanged) {
      this.updateSegments();
    }
  }

  onMouseReleased() {
    this.draggingAnchor = null;
  }

  updateSegments() {
    this.segments = this._createSegments();
  }

  reduce() {
    return {
      id: this.id,
      from: this.from.id,
      to: this.to ? this.to.id : null,
      anchors: this.anchors
    };
  }
}
