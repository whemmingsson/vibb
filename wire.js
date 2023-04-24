class Line {
  constructor(x1, y1, x2, y2) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
  }

  render() {
    stroke(4);
    line(this.x1, this.y1, this.x2, this.y2);
  }
}

class Wire {
  constructor(from, to) {
    if (from.type !== "output") throw Error("Wire needs to go from Output to Input (from was not output)");
    if (to.type !== "input") throw Error("Wire needs to go from Output to Input (to was not input)");

    this.from = from;
    this.to = to;
  }

  render() {
    // For now, render it as a simple line
    stroke(4);
    //line(this.from.x, this.from.y, this.to.x, this.to.y);
  }
}
