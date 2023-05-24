class ClickArea extends ComponentBase {
  constructor(x, y, w, h, type) {
    super(true, true, false, false);
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.type = type;
  }

  render() {
    noStroke();
    GetScheme().ClickArea.applyFill();
    rect(this.x, this.y, this.w, this.h);
  }

  mouseIsOver() {
    return mouseX > this.x && mouseX < this.x + this.w && mouseY > this.y && mouseY < this.y + this.h;
  }

  onClick() {
    // NOOP - click event is handled in sketch.
  }
}
