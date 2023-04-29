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
    strokeWeight(Globals.WireWeight);
    if (this.mouseIsOver()) {
      ColorScheme.White.applyStroke();
      return;
    }

    this._getSignalColor().applyStroke();
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
    return isPointOnLine({ x: mouseX, y: mouseY }, { x: segment.x1, y: segment.y1 }, { x: segment.x2, y: segment.y2 })
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
    strokeWeight(Globals.StrokeWeight);
    ellipse(x, y, 10, 10);
  }

  _renderLine(x1, y1, x2, y2) {
    strokeWeight(Globals.WireWeight);
    line(x1, y1, x2, y2);
  }

  _getSignalColor() {
    return this.on ? ColorScheme.SignalOn : ColorScheme.SignalOff;
  }

  _renderLineSegments() {
    let segments = this._createTemporarySegments();
    segments.forEach(s => {
      if (this._mouseIsOverSegment(s)) {
        ColorScheme.White.applyStroke();
      }
      else {
        this._applyOnOffStrokeColor();
      }
      this._renderLine(s.x1, s.y1, s.x2, s.y2);
    })
  }

  _renderAnchorPoints() {
    this.anchors.forEach(a => this._renderAnchorPoint(a.x, a.y, this._getSignalColor()));
  }

  render() {
    if (this.anchors.length === 0) {
      this._applyStroke();
      line(this.from.x, this.from.y, this.to ? this.to.x : mouseX, this.to ? this.to.y : mouseY);
    }
    else {
      this._renderLineSegments();
      this._renderAnchorPoints();
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
      return;
    }

    // TODO: This only works for 1 anchor or anchors added to the right of the previous one
    // Solution is to split the line into line segments and use these to render the lines instead.
    // Detect hover on a specific segment, and then create the anchor point on that, effectively 
    // splitting the line segment into two new segments. 
    this.anchors.push({ x: mouseX, y: mouseY, anchor: true });
    return;

    // New approach (that was bad)
    let selectedLineSegment = this.lineSegments.length === 0
      ? new LineSegment(this.from.x, this.from.y, this.to.x, this.to.y)
      : this.lineSegments.find(ls => ls.mouseIsOver());

    if (selectedLineSegment) {
      let idx = this.lineSegments.indexOf(selectedLineSegment);
      let newSegments = selectedLineSegment.split(mouseX, mouseY);
      if (newSegments.length === 0) {
        console.log("Did not create two new segments");
        return;
      }
      // NOTE: This will only work for the first split
      this.lineSegments.push(newSegments[0]);
      this.lineSegments.push(newSegments[1]);
      this.anchors.push({ x: mouseX, y: mouseY });

      console.log(idx, newSegments);
    }
    else {
      throw Error("Could not find a line segment");
    }


  }
}
